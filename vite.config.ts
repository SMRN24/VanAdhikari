import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";

function previewFallbackBrief(record: Record<string, unknown>) {
  const district = String(record.district || "the selected district");
  const state = String(record.state || "the selected state");
  const reason = String(record.reason || "The selected record has an open review signal.");
  const pending = String(record.pending || "the reported pending volume");
  const days = String(record.days || "the reported decision time");
  const area = String(record.area || "the submitted area");
  const registry = String(record.registry || "the registry reference");
  return `SIGNAL\n${district}, ${state} is marked for human review because ${reason}\n\nWHY IT MATTERS\nThe record shows ${pending} pending cases and an average decision time of ${days}. The submitted area (${area}) should be checked against ${registry} before any conclusion is drawn.\n\nNEXT HUMAN CHECK\nCompare the source claim, registry entry, and latest field record for ${district}. Confirm the dates and measurements, document any mismatch, and treat this preview as a review lead—not a verdict.`;
}

function vitePluginAiReviewProxy(): Plugin {
  return {
    name: "vanadhikar-ai-review-proxy",
    configureServer(server) {
      server.middlewares.use("/api/ai/review-brief", async (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", async () => {
          try {
            const record = JSON.parse(body || "{}");
            const baseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
            const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
            if (!baseUrl || !apiKey) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ brief: previewFallbackBrief(record), model: "preview-fallback", synthetic: true, fallback: true }));
              return;
            }
            const prompt = "Create a concise field-officer review brief for this synthetic Forest Rights Act district record. Use only the supplied facts. Do not invent evidence, legal conclusions, or claimant details. Return exactly three labeled paragraphs: SIGNAL, WHY IT MATTERS, NEXT HUMAN CHECK. Keep the tone practical and cautious.\n\n" + JSON.stringify(record);
            const response = await fetch(baseUrl + "/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey }, body: JSON.stringify({ model: "gpt-5-mini", messages: [{ role: "system", content: "You are VanAdhikar's transparent AI review assistant. The dataset is synthetic. Never present a signal as a verdict." }, { role: "user", content: prompt }], max_completion_tokens: 360 }) });
            const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
            const brief = payload.choices?.[0]?.message?.content?.trim();
            if (!response.ok || !brief) throw new Error("AI review service unavailable");
            res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify({ brief, model: "gpt-5-mini", synthetic: true, fallback: false }));
          } catch {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ brief: previewFallbackBrief(record), model: "preview-fallback", synthetic: true, fallback: true }));
          }
        });
      });
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginAiReviewProxy()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    // WebDev handles file-change refreshes for the hosted preview. Disable
    // Vite's browser websocket so the preview never attempts a failing HMR
    // connection through the HTTPS proxy.
    hmr: false,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "3002-iu9xsnls15qn4u6yszbqh-c0699564.sg2.manus.computer",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
