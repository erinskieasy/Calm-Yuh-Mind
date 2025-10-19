import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertMeditationSessionSchema,
  insertChatMessageSchema,
  insertAssessmentResultSchema,
} from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Protected routes - require authentication
  app.get("/api/moods", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const moods = await storage.getMoodEntries(userId);
      res.json(moods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood entries" });
    }
  });

  app.post("/api/moods", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertMoodEntrySchema.parse(req.body);
      const mood = await storage.createMoodEntry({ ...data, userId });
      res.json(mood);
    } catch (error) {
      res.status(400).json({ error: "Invalid mood entry data" });
    }
  });

  app.get("/api/journals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const journals = await storage.getJournalEntries(userId);
      res.json(journals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertJournalEntrySchema.parse(req.body);
      const journal = await storage.createJournalEntry({ ...data, userId });
      res.json(journal);
    } catch (error) {
      res.status(400).json({ error: "Invalid journal entry data" });
    }
  });

  app.delete("/api/journals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteJournalEntry(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete journal entry" });
    }
  });

  app.get("/api/meditation-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getMeditationSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meditation sessions" });
    }
  });

  app.post("/api/meditation-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertMeditationSessionSchema.parse(req.body);
      const session = await storage.createMeditationSession({ ...data, userId });
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid meditation session data" });
    }
  });

  app.get("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Invalid message content" });
      }

      const userMessage = await storage.createChatMessage({
        userId,
        role: "user",
        content,
      });

      const allMessages = await storage.getChatMessages(userId);
      const chatHistory = allMessages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate and supportive mental health companion. Your role is to provide emotional support, coping strategies, and helpful resources. Always be empathetic, non-judgmental, and encouraging. If someone expresses thoughts of self-harm or severe distress, gently encourage them to seek professional help. Keep responses concise, warm, and actionable.",
          },
          ...chatHistory,
        ],
        max_tokens: 500,
      });

      const assistantContent =
        completion.choices[0]?.message?.content ||
        "I'm here to support you. How are you feeling?";

      const assistantMessage = await storage.createChatMessage({
        userId,
        role: "assistant",
        content: assistantContent,
      });

      res.json({ user: userMessage, assistant: assistantMessage });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const results = await storage.getAssessmentResults(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessment results" });
    }
  });

  app.post("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertAssessmentResultSchema.parse(req.body);
      const result = await storage.createAssessmentResult({ ...data, userId });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
