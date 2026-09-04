// server/index.ts
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function previewFallbackBrief(record) {
  const district = String(record.district || "the selected district");
  const state = String(record.state || "the selected state");
  const reason = String(record.reason || "The selected record has an open review signal.");
  const pending = String(record.pending || "the reported pending volume");
  const days = String(record.days || "the reported decision time");
  const area = String(record.area || "the submitted area");
  const registry = String(record.registry || "the registry reference");
  return `SIGNAL
${district}, ${state} is marked for human review because ${reason}

WHY IT MATTERS
The record shows ${pending} pending cases and an average decision time of ${days}. The submitted area (${area}) should be checked against ${registry} before any conclusion is drawn.

NEXT HUMAN CHECK
Compare the source claim, registry entry, and latest field record for ${district}. Confirm the dates and measurements, document any mismatch, and treat this preview as a review lead\u2014not a verdict.`;
}
async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "32kb" }));
  app.post("/api/ai/review-brief", async (req, res) => {
    const { district, state, risk, reason, claims, titles, pending, days, area, registry } = req.body ?? {};
    if (!district || !state || !reason) {
      return res.status(400).json({ error: "A complete district record is required." });
    }
    const baseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
    const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
    if (!baseUrl || !apiKey) {
      return res.json({ brief: previewFallbackBrief(req.body ?? {}), model: "preview-fallback", synthetic: true, fallback: true });
    }
    const prompt = `Create a concise field-officer review brief for this synthetic Forest Rights Act district record. Use only the supplied facts. Do not invent evidence, legal conclusions, or claimant details. Return exactly three labeled paragraphs: SIGNAL, WHY IT MATTERS, NEXT HUMAN CHECK. Keep the tone practical and cautious.

District: ${district}, ${state}
Rule-based risk: ${risk}
Existing rule signal: ${reason}
Claims: ${claims}
Titles: ${titles}
Pending: ${pending}
Average decision days: ${days}
Reported area: ${area}
Registry reference: ${registry}`;
    try {
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: "You are VanAdhikar's transparent AI review assistant. The dataset is synthetic. Never present a signal as a verdict." },
            { role: "user", content: prompt }
          ],
          max_completion_tokens: 360
        })
      });
      if (!response.ok) return res.status(502).json({ error: "The AI review service returned an error." });
      const payload = await response.json();
      const brief = payload.choices?.[0]?.message?.content?.trim();
      if (!brief) return res.status(502).json({ error: "The AI review service returned no brief." });
      return res.json({ brief, model: "gpt-5-mini", synthetic: true, fallback: false });
    } catch {
      return res.json({ brief: previewFallbackBrief(req.body ?? {}), model: "preview-fallback", synthetic: true, fallback: true });
    }
  });
  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
  const port = process.env.PORT || 3e3;
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
