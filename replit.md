# Serenity - Mental Health & Wellness Platform

## Overview

Serenity is a comprehensive mental health and wellness platform designed to provide users with tools for emotional self-care and mental health management. The application combines mood tracking, journaling, guided meditation, AI-powered chat support, mental health assessments, and ambient sounds in a calming, accessible interface.

The platform emphasizes emotional safety through thoughtful design, featuring soft color palettes, rounded interfaces, and generous spacing that reduces cognitive load. It's built as a full-stack web application with a focus on creating a digital sanctuary for users seeking mental wellness support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router

**UI Component System:**
- **shadcn/ui** components built on Radix UI primitives, providing accessible, customizable UI components
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Class Variance Authority (CVA)** for managing component variants
- Theme system supporting light/dark modes with localStorage persistence

**State Management:**
- **TanStack Query (React Query)** for server state management, caching, and data synchronization
- Local React state for UI-specific concerns
- Custom hooks for reusable stateful logic

**Design System:**
- Custom color palette inspired by wellness apps (Calm, Headspace, Sanvello)
- Typography using Inter (UI/body) and Outfit (display/headings) from Google Fonts
- Soft, rounded design language with generous spacing
- Mood-specific colors for emotional tracking (joy, calm, anxious, sad, energetic)

### Backend Architecture

**Server Framework:**
- **Express.js** as the HTTP server framework
- RESTful API design pattern with JSON responses
- Custom logging middleware for API request tracking
- Error handling middleware for centralized error responses

**Data Layer:**
- **Drizzle ORM** for type-safe database interactions
- **PostgreSQL** as the primary database (via Neon serverless)
- Schema-first design with Zod validation for runtime type safety
- In-memory storage fallback (MemStorage class) for development/testing

**Database Schema:**
```
- users (id, username, password)
- mood_entries (id, date, mood, intensity, note, created_at)
- journal_entries (id, title, content, mood, date, created_at)
- meditation_sessions (id, type, duration, completed, date, created_at)
- chat_messages (id, role, content, created_at)
- assessment_results (id, type, score, answers, date, created_at)
```

**API Endpoints:**
- `GET/POST /api/moods` - Mood tracking entries
- `GET/POST /api/journals` - Journal entries with CRUD operations
- `DELETE /api/journals/:id` - Delete specific journal entry
- `GET/POST /api/meditation-sessions` - Meditation practice tracking
- `GET/POST /api/chat` - AI chat message history and creation
- `GET/POST /api/assessments` - Mental health assessment results

**Development Environment:**
- Hot Module Replacement (HMR) in development via Vite middleware
- TypeScript compilation checking (noEmit mode)
- Custom Vite plugins for Replit integration (runtime error overlay, cartographer, dev banner)

### External Dependencies

**AI Integration:**
- **OpenAI API** for AI-powered chat support
  - Configured via environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Used for generating empathetic, supportive chat responses

**Database Service:**
- **Neon Serverless PostgreSQL** 
  - Connection via `DATABASE_URL` environment variable
  - Serverless driver from `@neondatabase/serverless`

**Third-Party UI Components:**
- **Radix UI** primitives for accessible component foundations (accordion, dialog, dropdown, popover, tabs, etc.)
- **Recharts** for data visualization (mood trends charts on dashboard)
- **Embla Carousel** for carousel functionality
- **cmdk** for command palette functionality
- **Lucide React** for icon system

**Session Management:**
- **connect-pg-simple** for PostgreSQL-backed session storage
- Express sessions for maintaining user state

**Form Handling:**
- **React Hook Form** with **Zod resolvers** for form validation
- **@hookform/resolvers** for integrating Zod schemas with forms

**Utility Libraries:**
- **date-fns** for date manipulation and formatting
- **clsx** and **tailwind-merge** for conditional class name composition
- **nanoid** for unique ID generation

**Development Tools:**
- **tsx** for running TypeScript in Node.js during development
- **esbuild** for production server bundling
- **drizzle-kit** for database migrations and schema management
- **PostCSS** with **Autoprefixer** for CSS processing