import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startGameRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get available categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Start a new game
  app.post("/api/game/start", async (req, res) => {
    try {
      const validatedData = startGameRequestSchema.parse(req.body);
      const gameState = await storage.generateQuiz(validatedData.category);
      res.json(gameState);
    } catch (error) {
      console.error("Error starting game:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to start game" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
