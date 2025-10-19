import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertMeditationSessionSchema,
  insertChatMessageSchema,
  insertAssessmentResultSchema,
  insertTherapistProfileSchema,
  updateTherapistProfileSchema,
  insertConsultationRequestSchema,
  insertCustomSoundSchema,
} from "@shared/schema";
import { calculateDistance } from "./utils/distance";
import OpenAI from "openai";
import multer from "multer";
import path from "path";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Configure multer for file uploads
const soundsDir = path.join(process.cwd(), "uploads", "sounds");
const imagesDir = path.join(process.cwd(), "uploads", "journal-images");
const voiceNotesDir = path.join(process.cwd(), "uploads", "voice-notes");

if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(voiceNotesDir)) {
  fs.mkdirSync(voiceNotesDir, { recursive: true });
}

const soundStorageConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, soundsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageStorageConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, imagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "journal-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: soundStorageConfig,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "audio/mpeg" || path.extname(file.originalname).toLowerCase() === ".mp3") {
      cb(null, true);
    } else {
      cb(new Error("Only MP3 files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

const imageUpload = multer({
  storage: imageStorageConfig,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  }
});

const voiceNoteStorageConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, voiceNotesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "voice-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const voiceNoteUpload = multer({
  storage: voiceNoteStorageConfig,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg", "audio/mp4"];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(webm|ogg|wav|mp3|m4a)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for voice notes
  }
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
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const moods = await storage.getMoodEntries(userId, month, year);
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

  // Journal image upload endpoint
  app.post("/api/journals/upload-image", isAuthenticated, imageUpload.single("image"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const imageUrl = `/uploads/journal-images/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error: any) {
      // Clean up file if upload fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Upload journal image error:", error);
      res.status(400).json({ error: error.message || "Failed to upload image" });
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
              "You are a warm, empathetic mental health companion speaking to someone who needs genuine support. Respond naturally as if having a caring conversation with a friend. Vary your responses - avoid repetitive phrases and patterns. Show deep empathy by acknowledging their feelings before offering guidance. Use conversational language and avoid clinical jargon. Share coping strategies in a gentle, personalized way. When appropriate, validate their experiences and normalize their emotions. If they express thoughts of self-harm or severe distress, respond with compassion first, then gently suggest professional support. Keep your voice warm, authentic, and human. Tailor each response to their unique situation rather than generic advice.",
          },
          ...chatHistory,
        ],
        max_tokens: 500,
        temperature: 0.8,
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

  // Therapist profile routes
  app.get("/api/therapist/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getTherapistProfile(userId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch therapist profile" });
    }
  });

  app.post("/api/therapist/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertTherapistProfileSchema.parse(req.body);
      const profile = await storage.createTherapistProfile({ ...data, userId });
      res.json(profile);
    } catch (error: any) {
      console.error("Create profile error:", error);
      res.status(400).json({ error: error.message || "Invalid profile data" });
    }
  });

  app.put("/api/therapist/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = updateTherapistProfileSchema.parse(req.body);
      const profile = await storage.updateTherapistProfile(userId, data);
      res.json(profile);
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(400).json({ error: error.message || "Invalid profile data" });
    }
  });

  app.delete("/api/therapist/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteTherapistProfile(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete profile" });
    }
  });

  // Search nearby therapists
  app.get("/api/therapists/nearby", isAuthenticated, async (req: any, res) => {
    try {
      const { latitude, longitude, maxDistance, specialties, offersVirtual } = req.query;

      let profiles = await storage.getTherapistProfilesWithUserData();

      // Filter by accepting clients
      profiles = profiles.filter((p) => p.acceptingClients);

      // Filter by location if coordinates provided
      if (latitude && longitude) {
        const userLat = parseFloat(latitude as string);
        const userLon = parseFloat(longitude as string);
        const maxDist = maxDistance ? parseFloat(maxDistance as string) : 50; // default 50km

        profiles = profiles
          .filter((p) => p.latitude !== null && p.longitude !== null)
          .map((p) => ({
            ...p,
            distance: calculateDistance(userLat, userLon, p.latitude!, p.longitude!),
          }))
          .filter((p) => p.distance <= maxDist)
          .sort((a, b) => a.distance - b.distance);
      }

      // Filter by specialties
      if (specialties) {
        const specialtiesArray = (specialties as string).split(",").map((s) => s.trim().toLowerCase());
        profiles = profiles.filter((p) =>
          p.specialties.some((s) => specialtiesArray.includes(s.toLowerCase()))
        );
      }

      // Filter by virtual sessions
      if (offersVirtual === "true") {
        profiles = profiles.filter((p) => p.offersVirtualSessions);
      }

      res.json(profiles);
    } catch (error) {
      console.error("Search therapists error:", error);
      res.status(500).json({ error: "Failed to search therapists" });
    }
  });

  // Consultation request routes
  app.get("/api/consultation-requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let requests;
      if (user.role === "therapist") {
        requests = await storage.getTherapistConsultationRequests(userId);
      } else {
        requests = await storage.getClientConsultationRequests(userId);
      }

      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch consultation requests" });
    }
  });

  app.post("/api/consultation-requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertConsultationRequestSchema.parse({
        ...req.body,
        clientId: userId,
      });

      // Check if request already exists
      const existingRequests = await storage.getClientConsultationRequests(userId);
      const alreadyExists = existingRequests.some(
        (r) => r.therapistId === data.therapistId && r.status === "pending"
      );

      if (alreadyExists) {
        return res.status(400).json({ error: "Consultation request already pending" });
      }

      const request = await storage.createConsultationRequest(data);
      res.json(request);
    } catch (error: any) {
      console.error("Create request error:", error);
      res.status(400).json({ error: error.message || "Invalid request data" });
    }
  });

  app.put("/api/consultation-requests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { status, responseMessage } = req.body;

      const request = await storage.getConsultationRequest(id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      // Only therapist can update their received requests
      if (request.therapistId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updatedRequest = await storage.updateConsultationRequestStatus(
        id,
        status,
        responseMessage
      );
      res.json(updatedRequest);
    } catch (error) {
      res.status(400).json({ error: "Failed to update request" });
    }
  });

  // Custom sounds routes
  app.get("/api/custom-sounds", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sounds = await storage.getCustomSounds(userId);
      res.json(sounds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch custom sounds" });
    }
  });

  app.post("/api/custom-sounds", isAuthenticated, upload.single("audio"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { name } = req.body;
      if (!name) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Sound name is required" });
      }

      const filePath = `/uploads/sounds/${req.file.filename}`;
      const data = insertCustomSoundSchema.parse({ name, filePath });
      const sound = await storage.createCustomSound({ ...data, userId });
      res.json(sound);
    } catch (error: any) {
      // Clean up file if database insert fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Upload custom sound error:", error);
      res.status(400).json({ error: error.message || "Failed to upload custom sound" });
    }
  });

  app.delete("/api/custom-sounds/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;

      // Get the sound to find the file path
      const sounds = await storage.getCustomSounds(userId);
      const sound = sounds.find(s => s.id === id);

      if (!sound) {
        return res.status(404).json({ error: "Sound not found" });
      }

      // Delete from database
      await storage.deleteCustomSound(id, userId);

      // Delete file from filesystem
      const fullPath = path.join(process.cwd(), sound.filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Delete custom sound error:", error);
      res.status(500).json({ error: "Failed to delete custom sound" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const httpServer = createServer(app);
  return httpServer;
}
