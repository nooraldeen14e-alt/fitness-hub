import { Router } from "express";

const router = Router();

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

// Preferred keywords — models matching these (in order) rank first
const PREFERRED = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"];

async function discoverModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      models?: { name: string; supportedGenerationMethods?: string[] }[];
    };
    const vision = (data.models ?? [])
      .filter(m =>
        (m.supportedGenerationMethods ?? []).includes("generateContent") &&
        /gemini/i.test(m.name) &&
        !/embedding|aqa|imagen/i.test(m.name)
      )
      .map(m => m.name.replace("models/", ""));

    // Sort: preferred first (in priority order), then the rest
    const sorted: string[] = [];
    for (const pref of PREFERRED) {
      const match = vision.filter(v => v.includes(pref.replace("gemini-", "")));
      sorted.push(...match.filter(m => !sorted.includes(m)));
    }
    vision.filter(v => !sorted.includes(v)).forEach(v => sorted.push(v));
    console.log("Discovered Gemini models:", sorted.slice(0, 6).join(", "));
    return sorted;
  } catch (e) {
    console.error("Model discovery failed:", e);
    return [];
  }
}

async function callGemini(apiKey: string, mimeType: string, base64Data: string) {
  const models = await discoverModels(apiKey);
  if (models.length === 0) {
    return {
      ok: false,
      errBody: { error: { status: "UNAUTHENTICATED", message: "Could not list models — your API key may be invalid. Get a free key at aistudio.google.com/app/apikey" } },
    };
  }

  for (const model of models) {
    console.log(`Trying model: ${model}`);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({})) as {
        error?: { status?: string; code?: number; message?: string };
      };
      const status = errBody?.error?.status;
      const code   = errBody?.error?.code;
      if (status === "NOT_FOUND" || code === 404) {
        console.log(`Model ${model} returned NOT_FOUND, skipping…`);
        continue;
      }
      // Non-recoverable error
      return { ok: false, errBody };
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return { ok: true, data, model };
  }

  return {
    ok: false,
    errBody: { error: { message: `None of the ${models.length} discovered models accepted the request. Try a different API key.` } },
  };
}

router.post("/audit", async (req, res) => {
  const { image, apiKey: clientKey } = req.body as { image?: string; apiKey?: string };
  const apiKey = clientKey?.trim() || process.env["GEMINI_API_KEY"];

  if (!apiKey) {
    res.status(400).json({ error: "No API key provided. Enter your free Google AI Studio key in the audit page." });
    return;
  }
  if (!image) {
    res.status(400).json({ error: "Missing image field." });
    return;
  }

  const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) {
    res.status(400).json({ error: "Invalid image format." });
    return;
  }
  const [, mimeType, base64Data] = match;

  try {
    const result = await callGemini(apiKey, mimeType, base64Data);

    if (!result.ok) {
      const errBody = result.errBody as { error?: { status?: string; message?: string } };
      console.error("Gemini error:", JSON.stringify(errBody));
      const status = errBody?.error?.status;
      if (status === "UNAUTHENTICATED" || status === "PERMISSION_DENIED") {
        res.status(401).json({ error: "Invalid API key. Get a free key at aistudio.google.com/app/apikey" });
      } else if (status === "RESOURCE_EXHAUSTED") {
        res.status(429).json({ error: "Free quota exceeded for today. Try again tomorrow — it resets daily." });
      } else {
        res.status(502).json({ error: errBody?.error?.message ?? "AI service error. Please try again." });
      }
      return;
    }

    const raw = result.data!.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log(`✓ Audit completed using model: ${result.model}`);
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const audit = JSON.parse(cleaned);
    res.json(audit);
  } catch (err) {
    console.error("Audit route error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
