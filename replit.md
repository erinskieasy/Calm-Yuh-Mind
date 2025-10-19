# Serenity - Mental Health & Wellness Platform

## Overview

Serenity is a comprehensive mental health and wellness platform designed to support individuals in managing their mental wellbeing. The application provides tools for mood tracking, journaling, meditation, AI-powered support, self-assessment, and soothing ambient sounds—all wrapped in a calming, minimalist design.

## Purpose & Goals

- **Primary Goal**: Provide an accessible, calming digital space for mental health self-care
- **Target Users**: 
  - Individuals managing their own mental health
  - People seeking daily wellness practices
  - Those looking for AI-powered mental health support and resources
- **Future Expansion**: Potential for therapist portals, support groups, and professional connections

## Current Features

### Authentication & User Management
- **Multi-Provider Authentication**: Replit Auth integration supporting Google, GitHub, X (Twitter), Apple, and email/password
- **Session Management**: Secure session-based authentication with PostgreSQL persistence
- **User Data Isolation**: All data (moods, journals, assessments, chat history, meditation sessions) scoped to authenticated users
- **Landing Page**: Public landing page for unauthenticated users with feature showcase
- **Protected Routes**: All application features require authentication
- **User Profiles**: Support for client and therapist roles (foundation for future therapist portal)

### 1. Dashboard
- Real-time statistics overview (mood entries, journal count, meditation time)
- 7-day mood trend visualization with interactive charts
- Quick snapshot of wellness progress

### 2. Mood Tracker
- Log daily moods with 5 emotional states (Joyful, Calm, Neutral, Anxious, Sad)
- Intensity rating (1-5 scale)
- Optional notes for each mood entry
- 30-day visual mood calendar with color-coded indicators

### 3. Digital Journal
- Rich text editor for capturing thoughts and feelings
- Create, view, and delete journal entries
- Chronological timeline view
- Date-stamped entries with full content display

### 4. Meditation & Breathing
- 4 guided meditation exercises:
  - 4-7-8 Breathing (5 min)
  - Box Breathing (5 min)
  - Mindful Awareness (10 min)
  - Body Scan (15 min)
- Interactive circular timer with visual progress
- Session tracking and total meditation time statistics

### 5. AI Support Chat
- Compassionate AI companion powered by OpenAI (GPT-4o-mini)
- Emotional support and coping strategies
- Conversation history persistence
- Real-time chat interface with role-based message display

### 6. Self-Assessment Tools
- **PHQ-9**: Depression screening (9 questions)
- **GAD-7**: Generalized anxiety screening (7 questions)
- Auto-advancing questionnaire flow
- Score interpretation with severity levels
- Historical results tracking

### 7. Soothing Sounds
- 6 ambient soundscapes:
  - Ocean Waves
  - Rainfall
  - Forest Ambience
  - Wind Chimes
  - Crackling Fire
  - White Noise
- Volume control
- Persistent bottom player bar when active

### 8. Theme Support
- Light and dark mode toggle
- Persistent theme preference
- Calming color palette optimized for both modes

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight SPA routing)
- **State Management**: TanStack Query v5 for server state
- **UI Components**: Shadcn UI with Radix primitives
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for mood visualization
- **Fonts**: Inter (body), Outfit (display headings)

### Backend Stack
- **Server**: Express.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Replit Auth with session-based authentication
- **Data Storage**: PostgreSQL with user-scoped data isolation
- **AI Integration**: OpenAI API (GPT-4o-mini) via Replit AI Integrations
- **Validation**: Zod schemas with Drizzle-Zod
- **Session Store**: PostgreSQL session persistence

### Design System

**Color Palette:**
- Primary: Sage Green (hsl(160, 45%, 65%)) - CTAs, progress
- Background (Light): Soft Sky Blue (hsl(210, 65%, 98%))
- Background (Dark): Deep Navy (hsl(220, 20%, 15%))
- Accent: Calming blues and greens throughout

**Typography:**
- Display: Outfit (headings, titles)
- Body: Inter (all content)
- Font sizes: Responsive scale from 0.75rem to 2.5rem

**Spacing:**
- Consistent padding: p-4, p-6, p-8
- Grid gaps: gap-4, gap-6
- Generous whitespace for reduced cognitive load

### API Routes

**Authentication Routes:**
```
GET  /api/auth/user              - Get authenticated user (returns 401 if not authenticated)
GET  /api/logout                 - Logout current user
GET  /login                      - Replit Auth login page (redirects to OAuth providers)
```

**Protected Data Routes** (all require authentication):
```
GET  /api/moods                  - Fetch user's mood entries
POST /api/moods                  - Create mood entry
GET  /api/journals               - Fetch user's journal entries
POST /api/journals               - Create journal entry
DELETE /api/journals/:id         - Delete journal entry (user owns it)
GET  /api/meditation-sessions    - Fetch user's meditation sessions
POST /api/meditation-sessions    - Create session record
GET  /api/chat                   - Fetch user's chat history
POST /api/chat                   - Send message, get AI response
GET  /api/assessments            - Fetch user's assessment results
POST /api/assessments            - Save assessment result
```

## Data Models

### User
```typescript
{
  id: serial (auto-increment primary key)
  email: string (unique, from auth provider)
  name: string | null
  role: string ('client' | 'therapist')
  createdAt: timestamp
}
```

### MoodEntry
```typescript
{
  id: serial (auto-increment primary key)
  userId: integer (foreign key to users)
  date: string (YYYY-MM-DD)
  mood: string (joyful|calm|neutral|anxious|sad)
  intensity: number (1-5)
  note: string | null
  createdAt: timestamp
}
```

### JournalEntry
```typescript
{
  id: serial (auto-increment primary key)
  userId: integer (foreign key to users)
  title: string
  content: string
  mood: string | null
  date: string
  createdAt: timestamp
}
```

### MeditationSession
```typescript
{
  id: serial (auto-increment primary key)
  userId: integer (foreign key to users)
  type: string (exercise ID)
  duration: number (minutes)
  completed: number (minutes)
  date: string
  createdAt: timestamp
}
```

### ChatMessage
```typescript
{
  id: serial (auto-increment primary key)
  userId: integer (foreign key to users)
  role: 'user' | 'assistant'
  content: string
  createdAt: timestamp
}
```

### AssessmentResult
```typescript
{
  id: serial (auto-increment primary key)
  userId: integer (foreign key to users)
  type: string (phq-9|gad-7)
  score: number
  answers: string (JSON array)
  date: string
  createdAt: timestamp
}
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn components
│   │   │   ├── app-sidebar.tsx  # Main navigation
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── pages/
│   │   │   ├── dashboard.tsx
│   │   │   ├── mood-tracker.tsx
│   │   │   ├── journal.tsx
│   │   │   ├── meditation.tsx
│   │   │   ├── chat.tsx
│   │   │   ├── assessment.tsx
│   │   │   └── sounds.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── routes.ts               # API endpoints
│   ├── storage.ts              # In-memory data layer
│   └── index.ts
├── shared/
│   └── schema.ts               # Shared types & schemas
├── design_guidelines.md        # Comprehensive design system
└── replit.md                   # This file
```

## Key Features & Implementation Notes

### AI Chat Integration
- Uses Replit AI Integrations (OpenAI-compatible)
- No API key required (billed to Replit credits)
- System prompt optimized for mental health support
- Gentle encouragement to seek professional help for severe cases

### Assessment Tools
- Based on validated screening questionnaires (PHQ-9, GAD-7)
- Auto-advancing question flow
- Score interpretation with color-coded severity levels
- Historical tracking of results over time

### Mood Visualization
- 7-day trend chart on dashboard using Recharts
- 30-day calendar view with color-coded mood indicators
- Average intensity calculation for multi-entry days

### Theme Implementation
- CSS custom properties for color tokens
- ThemeProvider with localStorage persistence
- Smooth transitions between light/dark modes
- All components support both themes

## Development Guidelines

### Running the Application
```bash
npm run dev  # Starts Express + Vite dev servers on port 5000
```

### Adding New Features
1. Define data model in `shared/schema.ts`
2. Add storage methods to `IStorage` interface in `server/storage.ts`
3. Implement API routes in `server/routes.ts`
4. Create React components in `client/src/pages/` or `client/src/components/`
5. Add routes to `client/src/App.tsx`
6. Update sidebar navigation in `client/src/components/app-sidebar.tsx`

### Design System
- Follow `design_guidelines.md` religiously for visual consistency
- Use existing Shadcn components from `@/components/ui`
- Apply `hover-elevate` and `active-elevate-2` utilities for interactions
- Maintain generous spacing (p-6, gap-6) throughout
- Use `font-display` for headings, default sans for body text

## User Preferences

- **Visual Design**: Calming, minimalist aesthetic with soft colors
- **Interaction**: Smooth, subtle animations; no jarring transitions
- **Accessibility**: High contrast ratios, clear focus states, WCAG AA compliant
- **Tone**: Supportive, non-clinical, encouraging language

## Recent Changes

**October 19, 2025 - Authentication & Database Migration**
- Migrated from in-memory storage to PostgreSQL database
- Implemented Replit Auth with multi-provider support (Google, GitHub, X, Apple, email/password)
- Added user-scoped data architecture with userId foreign keys across all entities
- Created landing page for unauthenticated users
- Updated all API routes to require authentication and filter by userId
- Fixed auth hook to properly handle 401 responses (return null instead of throwing)
- Session persistence in PostgreSQL
- All features now support multiple users with data isolation
- E2E testing confirmed landing page and authentication flow working

**October 19, 2025 - Initial MVP**
- All 7 core features implemented (mood tracking, journaling, meditation, AI chat, assessments, sounds, theme)
- Design system configured with calming color palette
- OpenAI integration via Replit AI Integrations
- TypeScript type safety enforced throughout

## Future Enhancements (Post-MVP)

1. **Therapist Portal**
   - Client progress tracking
   - Secure data access
   - Session notes and observations

2. **Professional Connections**
   - Therapist directory
   - Appointment scheduling
   - Secure messaging

3. **Support Groups**
   - Moderated community spaces
   - Topic-based groups
   - Peer support features

4. **Data Export**
   - PDF reports for healthcare providers
   - CSV export of mood/journal data
   - Shareable progress insights

5. **Notifications**
   - Daily mood check-in reminders
   - Meditation practice nudges
   - Journaling prompts

6. **Additional Features**
   - Audio-guided meditations
   - Progress badges/achievements
   - Customizable mood categories
   - Advanced data analytics

## Important Notes

- **Data Persistence**: Using PostgreSQL database (Neon) - data persists across restarts
- **Authentication**: Session-based authentication with Replit Auth - supports multiple OAuth providers
- **User Data Isolation**: All user data is scoped by userId - users only see their own data
- **AI Costs**: OpenAI API calls are billed to Replit credits
- **Privacy**: All data stays within the application; no external analytics
- **Medical Disclaimer**: This is a wellness tool, not a replacement for professional mental health care

## Support & Resources

- Design Guidelines: See `design_guidelines.md`
- Component Library: Shadcn UI documentation
- API Documentation: See API Routes section above
- Testing: E2E tests cover all major user journeys

---

**Last Updated**: October 19, 2025
**Version**: 1.0.0 (MVP)
**Status**: ✅ Production Ready
