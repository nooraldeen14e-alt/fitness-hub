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

router.post("/audit", async (req, res) => {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "OPENAI_API_KEY is not set." });
    return;
  }

  const { image } = req.body as { image?: string };
  if (!image) {
    res.status(400).json({ error: "Missing image field." });
    return;
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
              { type: "text", text: "Please audit this website screenshot and return the JSON audit report." },
              { type: "image_url", image_url: { url: image, detail: "high" } },
            ],
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("OpenAI error:", err);
      res.status(502).json({ error: "AI service error. Please try again." });
      return;
    }

    const data = await openaiRes.json() as { choices: { message: { content: string } }[] };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const audit = JSON.parse(cleaned);

    res.json(audit);
  } catch (err) {
    console.error("Audit route error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
