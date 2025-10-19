import {
  type User,
  type InsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type JournalEntry,
  type InsertJournalEntry,
  type MeditationSession,
  type InsertMeditationSession,
  type ChatMessage,
  type InsertChatMessage,
  type AssessmentResult,
  type InsertAssessmentResult,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMoodEntries(): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;

  getJournalEntries(): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  deleteJournalEntry(id: string): Promise<void>;

  getMeditationSessions(): Promise<MeditationSession[]>;
  createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession>;

  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  getAssessmentResults(): Promise<AssessmentResult[]>;
  createAssessmentResult(result: InsertAssessmentResult): Promise<AssessmentResult>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moodEntries: Map<string, MoodEntry>;
  private journalEntries: Map<string, JournalEntry>;
  private meditationSessions: Map<string, MeditationSession>;
  private chatMessages: Map<string, ChatMessage>;
  private assessmentResults: Map<string, AssessmentResult>;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.journalEntries = new Map();
    this.meditationSessions = new Map();
    this.chatMessages = new Map();
    this.assessmentResults = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const entry: MoodEntry = {
      ...insertEntry,
      note: insertEntry.note ?? null,
      id,
      createdAt: new Date(),
    };
    this.moodEntries.set(id, entry);
    return entry;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = {
      ...insertEntry,
      mood: insertEntry.mood ?? null,
      id,
      createdAt: new Date(),
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    this.journalEntries.delete(id);
  }

  async getMeditationSessions(): Promise<MeditationSession[]> {
    return Array.from(this.meditationSessions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createMeditationSession(
    insertSession: InsertMeditationSession
  ): Promise<MeditationSession> {
    const id = randomUUID();
    const session: MeditationSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.meditationSessions.set(id, session);
    return session;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getAssessmentResults(): Promise<AssessmentResult[]> {
    return Array.from(this.assessmentResults.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createAssessmentResult(
    insertResult: InsertAssessmentResult
  ): Promise<AssessmentResult> {
    const id = randomUUID();
    const result: AssessmentResult = {
      ...insertResult,
      id,
      createdAt: new Date(),
    };
    this.assessmentResults.set(id, result);
    return result;
  }
}

export const storage = new MemStorage();
