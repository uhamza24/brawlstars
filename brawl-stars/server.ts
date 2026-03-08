import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Proxy to Brawl Stars API
  app.get("/api/brawlstars/player/:tag", async (req, res) => {
    const { tag } = req.params;
    const apiKey = process.env.BRAWL_STARS_API_KEY;

    if (!apiKey || apiKey === "MY_BRAWL_STARS_API_KEY") {
      // Fallback for demo if key is not configured
      return res.json({
        name: "DEMO PLAYER",
        trophies: 25000,
        isDemo: true
      });
    }

    try {
      // Tags in the API must be URL encoded and start with %23 instead of #
      const formattedTag = tag.startsWith("#") ? tag.replace("#", "%23") : `%23${tag}`;
      
      const response = await axios.get(`https://api.brawlstars.com/v1/players/${formattedTag}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("Brawl Stars API Error:", error.response?.data || error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Failed to fetch player data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
