# CalmYuhMind - Mental Health & Wellness Platform

## Overview
CalmYuhMind is a comprehensive mental health and wellness platform designed to support individuals in managing their mental well-being. It provides tools for mood tracking, journaling, meditation, AI-powered support, self-assessment, soothing ambient sounds, and a nearby therapist directory with location-based search. The primary goal is to offer an accessible, calming digital space for self-care and professional connection, targeting individuals managing their mental health, seeking wellness practices, and those looking for AI support or mental health professionals.

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
- **Theme System**: Four custom gradient themes with full CSS variable definitions:
  - **Default**: Original calming sage and sky blue palette
  - **Midnight Breeze**: Light blue to deep midnight gradient for tranquility and reflection
  - **Tropical Sunset**: Warm sunset oranges and reds for energy and optimism
  - **Meadow Fields**: Fresh meadow greens for growth and renewal
  - Themes persist via localStorage and apply site-wide with smooth transitions

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack Query v5 for server state, Recharts for visualizations, Framer Motion for animations, Tiptap rich text editor.
- **Backend**: Express.js server with Multer for file uploads (custom sounds, journal images).
- **Authentication**: Replit Auth integration supporting multiple providers (Google, GitHub, X, Apple, email/password) with secure, session-based authentication persisted in PostgreSQL. All application features require authentication, and user data is isolated.
- **AI Integration**: OpenAI API (GPT-4o-mini + Whisper) via Replit AI Integrations for a compassionate AI companion with conversation history persistence. Features three voice interaction modes:
  - **(1) Voice-to-text input**: Quick voice-to-text with automatic AI voice response using Web Speech API
  - **(2) Voice note recording**: Users record audio (MediaRecorder captures webm), audio uploaded to server, OpenAI Whisper transcribes on backend, AI receives transcription and responds. Voice notes stored with playable audio in chat history and display the transcribed text.
  - **(3) Text-to-speech output**: AI responses spoken aloud using Web Speech Synthesis API (works for both text and voice note responses)
  - Voice notes display as playable audio messages with native HTML5 audio controls and transcribed text in chat history
  - Server-side Whisper transcription ensures accuracy and triggers AI responses
  - Text chat enhanced with empathetic, varied responses using higher temperature setting (0.8) and improved system prompt for natural, personalized conversations
- **Assessment Tools**: Comprehensive collection of 6 validated mental health screening tools (PHQ-9, GAD-7, PSS-10, Rosenberg Self-Esteem, UCLA Loneliness, PCL-5 Short) with randomized question presentation, auto-advancing flows, color-coded score interpretation, proper reverse scoring, and historical tracking.
- **Therapist Directory**: Interactive OpenStreetMap-based therapist finder with live location support. Uses browser Geolocation API to pinpoint user location, integrates with Overpass API to query OpenStreetMap for mental health professionals (psychotherapists, psychiatrists, mental health clinics) within a configurable radius (1-20km). Displays results on interactive map with markers, popups showing contact details, and visual search radius indicator.
- **Global Audio Context**: React Context API provides persistent audio playback across all pages with centralized state management for volume and track selection.

### Feature Specifications
- **Dashboard**: Real-time statistics, 7-day mood trend.
- **Mood Tracker**: Log daily moods with intensity, notes, and a 30-day visual calendar with daily averaging. When multiple moods are logged on the same day, the system calculates a weighted average based on mood values (joyful=5, calm=4, neutral=3, anxious=2, sad=1) and intensities. Calendar displays the average mood with color coding and entry count badges. Dialog shows both daily average and all individual entries with timestamps.
- **Digital Journal**: Rich HTML editor powered by Tiptap with full formatting capabilities (bold, italic, underline, headings, lists, alignment), image upload support (10MB limit, JPEG/PNG/GIF/WebP), and chronological timeline display.
- **Meditation & Breathing**: Guided exercises with interactive timers and session tracking.
- **Soothing Sounds**: 6 ambient soundscapes (Ocean Waves, Rainfall, Wind Chimes, Crackling Fire, White Noise, Nature Sounds) plus custom MP3 upload feature with volume control, persistent player, and continuous playback across all pages via global audio context. User-isolated storage with 50MB file limit.
- **Mini Games**: Four calming, wellness-focused games for mindful breaks: Memory Match (peaceful icon matching to improve focus), Breathing Rhythm (follow breathing patterns to calm the mind), Mindful Bubbles (pop bubbles with satisfying sound effects to release stress), and Tic Tac Toe (strategic thinking against AI with score tracking). Each game tracks progress and provides relaxing interactions.
- **Anonymous Message Forum**: Placeholder page for future community feature where users can share thoughts and connect anonymously. Located at `/anon-forum` in Community section of sidebar.
- **Settings**: Comprehensive user preferences page with multiple customization options:
  - **Profile Pictures**: 4 preset image avatars (Flower 🌸, Leaf 🍃, Moon 🌙, Sun ☀️) using actual image files from attached_assets, plus custom upload functionality (5MB limit, JPEG/PNG/GIF/WebP). Custom uploads stored in `/uploads/profile-pictures/`. Database stores either `preset:flower` (etc.) or `/uploads/profile-pictures/[filename]` path.
  - **Font Styles**: 4 font options including Inter (default), Georgia (serif), Comic Sans (playful), and OpenDyslexic (dyslexia-friendly with enhanced spacing)
  - **Color Themes**: 4 gradient themes with increased saturation (Default sage/blue, Midnight Breeze blue, Tropical Sunset orange/red, Meadow Fields green)
  - **Account**: Logout functionality
  - All preferences persist via localStorage (fonts/themes) or database (profile pictures)
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
- **Data Isolation**: All user data (moods, journals, assessments, chat history, meditation sessions, therapist profiles, custom sounds, uploaded images) is scoped to authenticated users.
- **Validation**: Zod schemas used for data validation.
- **Modularity**: Project structure separates client, server, and shared components.
- **File Storage**: Uploaded files stored in `uploads/sounds/`, `uploads/journal-images/`, and `uploads/profile-pictures/` directories with automatic cleanup on deletion.

## External Dependencies
- **Database**: PostgreSQL (Neon) with Drizzle ORM for data persistence and session storage.
- **Authentication**: Replit Auth.
- **AI Services**: OpenAI API (GPT-4o-mini) accessed via Replit AI Integrations.
- **Mapping**: OpenStreetMap tiles via Leaflet.js and React-Leaflet for interactive maps.
- **Geolocation**: Browser Geolocation API for user location detection.
- **POI Search**: Overpass API for querying OpenStreetMap mental health facility data (no API key required).