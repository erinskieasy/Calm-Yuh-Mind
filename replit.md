# Serenity - Mental Health & Wellness Platform

## Overview
Serenity is a comprehensive mental health and wellness platform designed to support individuals in managing their mental well-being. It provides tools for mood tracking, journaling, meditation, AI-powered support, self-assessment, soothing ambient sounds, and a nearby therapist directory with location-based search. The primary goal is to offer an accessible, calming digital space for self-care and professional connection, targeting individuals managing their mental health, seeking wellness practices, and those looking for AI support or mental health professionals.

## User Preferences
- **Visual Design**: Calming, minimalist aesthetic with soft colors
- **Interaction**: Smooth, subtle animations; no jarring transitions
- **Accessibility**: High contrast ratios, clear focus states, WCAG AA compliant
- **Tone**: Supportive, non-clinical, encouraging language

## System Architecture
Serenity utilizes a modern full-stack architecture with a clear separation of concerns.

### UI/UX Decisions
- **Design System**: Shadcn UI with Radix primitives, Tailwind CSS, custom design system.
- **Color Palette**: Calming Sage Green, Soft Sky Blue (light mode background), Deep Navy (dark mode background), with accent blues and greens.
- **Typography**: Outfit for headings, Inter for body text, with a responsive font scale.
- **Spacing**: Generous and consistent spacing (e.g., `p-4`, `gap-4`) for reduced cognitive load.
- **Theme**: Light and dark mode toggle with persistent preference, smooth transitions.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack Query v5 for server state, Recharts for visualizations, Framer Motion for animations.
- **Backend**: Express.js server.
- **Authentication**: Replit Auth integration supporting multiple providers (Google, GitHub, X, Apple, email/password) with secure, session-based authentication persisted in PostgreSQL. All application features require authentication, and user data is isolated.
- **AI Integration**: OpenAI API (GPT-4o-mini) via Replit AI Integrations for a compassionate AI companion, with conversation history persistence.
- **Assessment Tools**: Comprehensive collection of 6 validated mental health screening tools (PHQ-9, GAD-7, PSS-10, Rosenberg Self-Esteem, UCLA Loneliness, PCL-5 Short) with randomized question presentation, auto-advancing flows, color-coded score interpretation, proper reverse scoring, and historical tracking.
- **Therapist Directory**: Location-based search using the browser Geolocation API, distance filtering (Haversine formula), and specialty filtering. Therapist profiles can be managed by professionals.
- **Global Audio Context**: React Context API provides persistent audio playback across all pages with centralized state management for volume and track selection.

### Feature Specifications
- **Dashboard**: Real-time statistics, 7-day mood trend.
- **Mood Tracker**: Log daily moods with intensity, notes, and a 30-day visual calendar.
- **Digital Journal**: Rich text editor for entries with chronological timeline.
- **Meditation & Breathing**: Guided exercises with interactive timers and session tracking.
- **Soothing Sounds**: 5 ambient soundscapes (Ocean Waves, Rainfall, Wind Chimes, Crackling Fire, White Noise) with volume control, persistent player, and continuous playback across all pages via global audio context.
- **Self-Assessment Tools**: 
  - **Depression**: PHQ-9 (9 questions, 5-level severity)
  - **Anxiety**: GAD-7 (7 questions, 4-level severity)
  - **Stress**: PSS-10 Perceived Stress Scale (10 questions with reverse scoring)
  - **Self-Esteem**: Rosenberg Self-Esteem Scale (10 questions with reverse scoring)
  - **Social Connection**: UCLA Loneliness Scale Short (8 questions with reverse scoring)
  - **Trauma**: PCL-5 Short PTSD Checklist (8 questions, 4-level severity)
  - **Question Randomization**: Questions shuffle each time to reduce response bias
  - **Proper Scoring**: Handles reverse-scored items automatically
  - **Results Tracking**: Displays last 10 assessments with color-coded interpretations
  - **Category Organization**: Assessments grouped by mental health domain

### System Design Choices
- **Data Isolation**: All user data (moods, journals, assessments, chat history, meditation sessions, therapist profiles) is scoped to authenticated users.
- **Validation**: Zod schemas used for data validation.
- **Modularity**: Project structure separates client, server, and shared components.

## External Dependencies
- **Database**: PostgreSQL (Neon) with Drizzle ORM for data persistence and session storage.
- **Authentication**: Replit Auth.
- **AI Services**: OpenAI API (GPT-4o-mini) accessed via Replit AI Integrations.
- **Geolocation**: Browser Geolocation API for "Find Nearby Therapists" feature.