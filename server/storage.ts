import {
  users,
  moodEntries,
  journalEntries,
  meditationSessions,
  chatMessages,
  assessmentResults,
  therapistProfiles,
  consultationRequests,
  customSounds,
  forums,
  forumPosts,
  forumComments,
  type User,
  type UpsertUser,
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
  type TherapistProfile,
  type InsertTherapistProfile,
  type UpdateTherapistProfile,
  type ConsultationRequest,
  type InsertConsultationRequest,
  type CustomSound,
  type InsertCustomSound,
  type Forum,
  type ForumPost,
  type InsertForumPost,
  type ForumComment,
  type InsertForumComment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // User-specific data operations
  getMoodEntries(userId: string, month?: number, year?: number): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;

  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  getJournalEntry(id: string, userId: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  deleteJournalEntry(id: string, userId: string): Promise<void>;

  getMeditationSessions(userId: string): Promise<MeditationSession[]>;
  createMeditationSession(session: InsertMeditationSession): Promise<MeditationSession>;

  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  getAssessmentResults(userId: string): Promise<AssessmentResult[]>;
  createAssessmentResult(result: InsertAssessmentResult): Promise<AssessmentResult>;

  // Therapist profiles
  getTherapistProfile(userId: string): Promise<TherapistProfile | undefined>;
  getTherapistProfiles(): Promise<TherapistProfile[]>;
  getTherapistProfilesWithUserData(): Promise<(TherapistProfile & { user: User })[]>;
  createTherapistProfile(profile: InsertTherapistProfile): Promise<TherapistProfile>;
  updateTherapistProfile(userId: string, profile: UpdateTherapistProfile): Promise<TherapistProfile>;
  deleteTherapistProfile(userId: string): Promise<void>;

  // Consultation requests
  getConsultationRequest(id: string): Promise<ConsultationRequest | undefined>;
  getClientConsultationRequests(clientId: string): Promise<ConsultationRequest[]>;
  getTherapistConsultationRequests(therapistId: string): Promise<ConsultationRequest[]>;
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  updateConsultationRequestStatus(
    id: string,
    status: string,
    responseMessage?: string
  ): Promise<ConsultationRequest>;

  // Custom sounds
  getCustomSounds(userId: string): Promise<CustomSound[]>;
  createCustomSound(sound: InsertCustomSound): Promise<CustomSound>;
  deleteCustomSound(id: string, userId: string): Promise<void>;

  // Forums
  getForums(): Promise<Forum[]>;
  getForumPosts(forumId: string): Promise<(ForumPost & { commentCount: number })[]>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  deleteForumPost(id: string, userId: string): Promise<void>;
  flagForumPost(id: string, reason: string): Promise<void>;
  
  getForumComments(postId: string): Promise<ForumComment[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  deleteForumComment(id: string, userId: string): Promise<void>;
  flagForumComment(id: string, reason: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Mood entries
  async getMoodEntries(userId: string, month?: number, year?: number): Promise<MoodEntry[]> {
    let query = db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId));

    // If month and year are provided, filter by date range
    if (month !== undefined && year !== undefined) {
      // Create start and end dates for the month
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      query = query.where(
        and(
          eq(moodEntries.userId, userId),
          sql`${moodEntries.date} >= ${startDate}`,
          sql`${moodEntries.date} <= ${endDate}`
        )
      );
    } else if (year !== undefined) {
      // If only year is provided, filter by year
      const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
      const endDate = new Date(year, 11, 31).toISOString().split('T')[0];
      
      query = query.where(
        and(
          eq(moodEntries.userId, userId),
          sql`${moodEntries.date} >= ${startDate}`,
          sql`${moodEntries.date} <= ${endDate}`
        )
      );
    }

    return await query.orderBy(desc(moodEntries.createdAt));
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const [entry] = await db
      .insert(moodEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  // Journal entries
  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async getJournalEntry(id: string, userId: string): Promise<JournalEntry | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
    return entry;
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const [entry] = await db
      .insert(journalEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async deleteJournalEntry(id: string, userId: string): Promise<void> {
    await db
      .delete(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  }

  // Meditation sessions
  async getMeditationSessions(userId: string): Promise<MeditationSession[]> {
    return await db
      .select()
      .from(meditationSessions)
      .where(eq(meditationSessions.userId, userId))
      .orderBy(desc(meditationSessions.createdAt));
  }

  async createMeditationSession(
    insertSession: InsertMeditationSession
  ): Promise<MeditationSession> {
    const [session] = await db
      .insert(meditationSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  // Chat messages
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  // Assessment results
  async getAssessmentResults(userId: string): Promise<AssessmentResult[]> {
    return await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.userId, userId))
      .orderBy(desc(assessmentResults.createdAt));
  }

  async createAssessmentResult(
    insertResult: InsertAssessmentResult
  ): Promise<AssessmentResult> {
    const [result] = await db
      .insert(assessmentResults)
      .values(insertResult)
      .returning();
    return result;
  }

  // Therapist profiles
  async getTherapistProfile(userId: string): Promise<TherapistProfile | undefined> {
    const [profile] = await db
      .select()
      .from(therapistProfiles)
      .where(eq(therapistProfiles.userId, userId));
    return profile;
  }

  async getTherapistProfiles(): Promise<TherapistProfile[]> {
    return await db
      .select()
      .from(therapistProfiles)
      .orderBy(desc(therapistProfiles.createdAt));
  }

  async getTherapistProfilesWithUserData(): Promise<(TherapistProfile & { user: User })[]> {
    const results = await db
      .select()
      .from(therapistProfiles)
      .innerJoin(users, eq(therapistProfiles.userId, users.id))
      .orderBy(desc(therapistProfiles.createdAt));
    
    return results.map(row => ({
      ...row.therapist_profiles,
      user: row.users,
    }));
  }

  async createTherapistProfile(insertProfile: InsertTherapistProfile): Promise<TherapistProfile> {
    const [profile] = await db
      .insert(therapistProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateTherapistProfile(
    userId: string,
    updateData: UpdateTherapistProfile
  ): Promise<TherapistProfile> {
    const [profile] = await db
      .update(therapistProfiles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(therapistProfiles.userId, userId))
      .returning();
    return profile;
  }

  async deleteTherapistProfile(userId: string): Promise<void> {
    await db
      .delete(therapistProfiles)
      .where(eq(therapistProfiles.userId, userId));
  }

  // Consultation requests
  async getConsultationRequest(id: string): Promise<ConsultationRequest | undefined> {
    const [request] = await db
      .select()
      .from(consultationRequests)
      .where(eq(consultationRequests.id, id));
    return request;
  }

  async getClientConsultationRequests(clientId: string): Promise<ConsultationRequest[]> {
    return await db
      .select()
      .from(consultationRequests)
      .where(eq(consultationRequests.clientId, clientId))
      .orderBy(desc(consultationRequests.createdAt));
  }

  async getTherapistConsultationRequests(therapistId: string): Promise<ConsultationRequest[]> {
    return await db
      .select()
      .from(consultationRequests)
      .where(eq(consultationRequests.therapistId, therapistId))
      .orderBy(desc(consultationRequests.createdAt));
  }

  async createConsultationRequest(
    insertRequest: InsertConsultationRequest
  ): Promise<ConsultationRequest> {
    const [request] = await db
      .insert(consultationRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateConsultationRequestStatus(
    id: string,
    status: string,
    responseMessage?: string
  ): Promise<ConsultationRequest> {
    const [request] = await db
      .update(consultationRequests)
      .set({
        status,
        responseMessage,
        respondedAt: new Date(),
      })
      .where(eq(consultationRequests.id, id))
      .returning();
    return request;
  }

  // Custom sounds
  async getCustomSounds(userId: string): Promise<CustomSound[]> {
    return await db
      .select()
      .from(customSounds)
      .where(eq(customSounds.userId, userId))
      .orderBy(desc(customSounds.createdAt));
  }

  async createCustomSound(insertSound: InsertCustomSound): Promise<CustomSound> {
    const [sound] = await db
      .insert(customSounds)
      .values(insertSound)
      .returning();
    return sound;
  }

  async deleteCustomSound(id: string, userId: string): Promise<void> {
    await db
      .delete(customSounds)
      .where(and(eq(customSounds.id, id), eq(customSounds.userId, userId)));
  }

  // Forums
  async getForums(): Promise<Forum[]> {
    return await db
      .select()
      .from(forums)
      .orderBy(forums.name);
  }

  async getForumPosts(forumId: string): Promise<(ForumPost & { commentCount: number })[]> {
    const posts = await db
      .select({
        id: forumPosts.id,
        forumId: forumPosts.forumId,
        userId: forumPosts.userId,
        title: forumPosts.title,
        content: forumPosts.content,
        isFlagged: forumPosts.isFlagged,
        flagReason: forumPosts.flagReason,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        commentCount: sql<number>`COUNT(DISTINCT ${forumComments.id})::int`,
      })
      .from(forumPosts)
      .leftJoin(forumComments, eq(forumComments.postId, forumPosts.id))
      .where(eq(forumPosts.forumId, forumId))
      .groupBy(forumPosts.id)
      .orderBy(desc(forumPosts.createdAt));
    
    return posts;
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const [post] = await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.id, id));
    return post;
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const [post] = await db
      .insert(forumPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async deleteForumPost(id: string, userId: string): Promise<void> {
    await db
      .delete(forumPosts)
      .where(and(eq(forumPosts.id, id), eq(forumPosts.userId, userId)));
  }

  async flagForumPost(id: string, reason: string): Promise<void> {
    await db
      .update(forumPosts)
      .set({
        isFlagged: true,
        flagReason: reason,
      })
      .where(eq(forumPosts.id, id));
  }

  async getForumComments(postId: string): Promise<ForumComment[]> {
    return await db
      .select()
      .from(forumComments)
      .where(eq(forumComments.postId, postId))
      .orderBy(forumComments.createdAt);
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const [comment] = await db
      .insert(forumComments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async deleteForumComment(id: string, userId: string): Promise<void> {
    await db
      .delete(forumComments)
      .where(and(eq(forumComments.id, id), eq(forumComments.userId, userId)));
  }

  async flagForumComment(id: string, reason: string): Promise<void> {
    await db
      .update(forumComments)
      .set({
        isFlagged: true,
        flagReason: reason,
      })
      .where(eq(forumComments.id, id));
  }
}

export const storage = new DatabaseStorage();
