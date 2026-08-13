import type { Handler } from "@netlify/functions";

const SYSTEM_PROMPT = `You are a senior digital marketing and UX consultant at Swissulife Media — a top-tier agency in the UAE/GCC. A potential client has submitted a screenshot of their website or digital asset for a free audit.

Analyse the screenshot and return a structured JSON audit with exactly this shape:

{
  "score": <overall score 0-100>,
  "summary": "<2-3 sentence executive summary of the page>",
  "categories": [
    {
      "name": "<category name>",
      "score": <0-100>,
      "emoji": "<single relevant emoji>",
      "issues": ["<specific, actionable issue>", ...],
      "wins": ["<specific strength worth keeping>", ...]
    }
  ],
  "topPriorities": ["<#1 most impactful fix>", "<#2>", "<#3>"],
  "verdict": "<one punchy sentence verdict>"
}

Use exactly these 6 categories in this order:
1. Visual Design & Branding (emoji 🎨)
2. User Experience & Layout (emoji 🧭)
3. Content & Messaging (emoji ✍️)
4. Call-to-Action & Conversion (emoji 🎯)
5. Mobile & Responsiveness (emoji 📱)
6. Trust & Social Proof (emoji 🏆)

Rules:
- Be specific — reference actual elements you see in the screenshot
- Be honest but constructive — don't give everyone 90+
- Each category should have 1-3 issues and 1-2 wins (can be 0 wins if truly poor)
- topPriorities must be the 3 highest-ROI fixes
- Return ONLY valid JSON — no markdown fences, no explanation text`;

export const handler: Handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: cors, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  let body: { image?: string; apiKey?: string };
  try { body = JSON.parse(event.body ?? "{}"); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON." }) }; }

  const { image, apiKey: clientKey } = body;
  const apiKey = clientKey?.trim() || process.env.GEMINI_API_KEY;

  if (!apiKey) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "No API key provided." }) };
  if (!image)  return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "Missing image." }) };

  const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "Invalid image format." }) };

  const [, mimeType, base64Data] = match;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SYSTEM_PROMPT + "\n\nPlease audit this website screenshot and return only the JSON audit report." },
              { inline_data: { mime_type: mimeType, data: base64Data } },
            ],
          }],
          generationConfig: { maxOutputTokens: 2000, temperature: 0.4 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({})) as { error?: { status?: string; message?: string } };
      const status = err?.error?.status;
      if (status === "RESOURCE_EXHAUSTED") {
        return { statusCode: 429, headers: cors, body: JSON.stringify({ error: "Free quota exceeded for today. Try again tomorrow." }) };
      }
      return { statusCode: 502, headers: cors, body: JSON.stringify({ error: err?.error?.message ?? "AI service error." }) };
    }

    const data = await geminiRes.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const audit = JSON.parse(cleaned);

    return { statusCode: 200, headers: { ...cors, "Content-Type": "application/json" }, body: JSON.stringify(audit) };
  } catch (err) {
    console.error("Audit function error:", err);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: "Something went wrong. Please try again." }) };
  }
};
