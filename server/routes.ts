import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
  app.get("/api/moods", async (_req, res) => {
    try {
      const moods = await storage.getMoodEntries();
      res.json(moods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood entries" });
    }
  });

  app.post("/api/moods", async (req, res) => {
    try {
      const data = insertMoodEntrySchema.parse(req.body);
      const mood = await storage.createMoodEntry(data);
      res.json(mood);
    } catch (error) {
      res.status(400).json({ error: "Invalid mood entry data" });
    }
  });

  app.get("/api/journals", async (_req, res) => {
    try {
      const journals = await storage.getJournalEntries();
      res.json(journals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journals", async (req, res) => {
    try {
      const data = insertJournalEntrySchema.parse(req.body);
      const journal = await storage.createJournalEntry(data);
      res.json(journal);
    } catch (error) {
      res.status(400).json({ error: "Invalid journal entry data" });
    }
  });

  app.delete("/api/journals/:id", async (req, res) => {
    try {
      await storage.deleteJournalEntry(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete journal entry" });
    }
  });

  app.get("/api/meditation-sessions", async (_req, res) => {
    try {
      const sessions = await storage.getMeditationSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meditation sessions" });
    }
  });

  app.post("/api/meditation-sessions", async (req, res) => {
    try {
      const data = insertMeditationSessionSchema.parse(req.body);
      const session = await storage.createMeditationSession(data);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid meditation session data" });
    }
  });

  app.get("/api/chat", async (_req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Invalid message content" });
      }

      const userMessage = await storage.createChatMessage({
        role: "user",
        content,
      });

      const allMessages = await storage.getChatMessages();
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
        role: "assistant",
        content: assistantContent,
      });

      res.json({ user: userMessage, assistant: assistantMessage });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/assessments", async (_req, res) => {
    try {
      const results = await storage.getAssessmentResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessment results" });
    }
  });

  app.post("/api/assessments", async (req, res) => {
    try {
      const data = insertAssessmentResultSchema.parse(req.body);
      const result = await storage.createAssessmentResult(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
