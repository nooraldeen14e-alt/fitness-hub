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
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "OpenAI API key not configured." }),
    };
  }

  let body: { image?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body." }) };
  }

  const { image } = body;
  if (!image) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing image field." }) };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 2000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please audit this website screenshot and return the JSON audit report.",
              },
              {
                type: "image_url",
                image_url: { url: image, detail: "high" },
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return {
        statusCode: 502,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "AI service error. Please try again." }),
      };
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    // Strip markdown fences if model adds them
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const audit = JSON.parse(cleaned);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(audit),
    };
  } catch (err) {
    console.error("Audit function error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Something went wrong. Please try again." }),
    };
  }
};
