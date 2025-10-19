# CalmYuhMind

Your personal companion for mental health and wellness.

## Features

- 🎭 **Mood Tracking** - Log your daily emotions and visualize patterns over time
- 📝 **Digital Journal** - Express your thoughts and feelings in a private, secure space
- 🧘 **Meditation** - Guided breathing exercises and mindfulness practices
- 💬 **AI Support** - Compassionate AI companion for emotional support and coping strategies
- ❤️ **Self-Assessment** - Evidence-based screenings to understand your mental health
- 🎵 **Soothing Sounds** - Calming ambient soundscapes to help you relax and focus
- 🎮 **Mini Games** - Relaxing games to help calm your mind
- 👥 **Anonymous Forums** - Share and connect with others in a safe space
- 🔍 **Find Therapists** - Locate mental health professionals near you

## Tech Stack

- **Frontend**: React, TypeScript, Wouter, TanStack Query, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: Passport.js with local strategy
- **AI**: OpenAI GPT-4 for chat support and content moderation

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (we recommend [Neon](https://neon.tech))
- OpenAI API key

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Calm-Yuh-Mind.git
   cd Calm-Yuh-Mind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Required environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `SESSION_SECRET` - A random secret for session encryption
   - `AI_INTEGRATIONS_OPENAI_API_KEY` - Your OpenAI API key

4. **Set up the database**
   
   Push the schema to your database:
   ```bash
   npm run db:push
   ```

5. **Create a user account**
   
   You can either:
   - Run the app and register through the UI at `/login`
   - Or create a user programmatically

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Project Structure

```
CalmYuhMind/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── contexts/    # React contexts
│   │   └── lib/         # Utility functions
├── server/              # Backend Express application
│   ├── routes.ts        # API routes
│   ├── localAuth.ts     # Authentication logic
│   ├── storage.ts       # Database operations
│   └── db.ts            # Database connection
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema definitions
└── uploads/             # User uploaded files
```

## Authentication

The app uses local authentication with username and password. Sessions are stored in PostgreSQL for security and persistence.

### First User

After setting up the database, you can create your first user by:
1. Navigating to `/login`
2. Clicking the "Register" tab
3. Filling out the registration form

## Database Schema

The app uses Drizzle ORM with PostgreSQL. Main tables include:
- `users` - User accounts
- `mood_entries` - Daily mood tracking
- `journal_entries` - Journal posts
- `meditation_sessions` - Meditation session history
- `chat_messages` - AI chat history
- `assessment_results` - Mental health assessment results
- `therapist_profiles` - Therapist information
- `forums` & `forum_posts` - Anonymous forum discussions
- `custom_sounds` - User-uploaded sounds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Important Notice

**CalmYuhMind is a wellness tool designed to support your mental health journey. It is not a replacement for professional mental health care.** If you're experiencing a crisis or need immediate support, please contact a mental health professional or crisis helpline:

- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741 (US)
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

## Deployment

This app is a traditional Node.js/Express server and is **NOT compatible with Vercel**. Use one of these platforms instead:

### 🚀 Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Calm-Yuh-Mind` repository
5. Railway will auto-detect the Node.js app
6. Add environment variables in the Railway dashboard:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `AI_INTEGRATIONS_OPENAI_API_KEY`
   - `PORT` (Railway sets this automatically, but you can override)
7. Deploy!

### 🎯 Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add environment variables in Render dashboard
6. Deploy!

### 📝 Environment Variables Needed

Make sure to set these on your deployment platform:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `SESSION_SECRET` - Random secret string for sessions
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Set to `production`

## License

MIT License - feel free to use this project for personal or educational purposes.

