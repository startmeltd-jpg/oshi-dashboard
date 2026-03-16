import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API proxy for Memory Vault - forward /api/* requests to Memory Vault API
  const MEMORY_VAULT_URL = process.env.MEMORY_VAULT_URL || "https://memorydash-g9jppxaa.manus.space";
  const MEMORY_VAULT_API_KEY = process.env.MEMORY_VAULT_API_KEY || "";

  app.use("/api", async (req, res) => {
    try {
      const targetUrl = `${MEMORY_VAULT_URL}/api${req.url}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (MEMORY_VAULT_API_KEY) {
        headers["Authorization"] = `Bearer ${MEMORY_VAULT_API_KEY}`;
      }

      const fetchOptions: RequestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== "GET" && req.method !== "HEAD") {
        let body = "";
        await new Promise<void>((resolve) => {
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on("end", () => resolve());
        });
        if (body) {
          fetchOptions.body = body;
        }
      }

      const response = await fetch(targetUrl, fetchOptions);
      const data = await response.text();

      res.status(response.status);
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== "transfer-encoding" && key.toLowerCase() !== "content-encoding") {
          res.setHeader(key, value);
        }
      });
      res.send(data);
    } catch (error) {
      console.error("API proxy error:", error);
      res.status(502).json({ error: "API proxy error" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
