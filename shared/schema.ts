import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  mood: text("mood").notNull(),
  intensity: integer("intensity").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  completed: integer("completed").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assessmentResults = pgTable("assessment_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  score: integer("score").notNull(),
  answers: text("answers").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentResultSchema = createInsertSchema(assessmentResults).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;
export type MeditationSession = typeof meditationSessions.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
export type AssessmentResult = typeof assessmentResults.$inferSelect;
