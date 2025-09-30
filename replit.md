# DoseWise

## Overview

DoseWise is a gamified micro-learning platform that delivers personalized daily learning cards to professionals. The application helps users master new skills through bite-sized content tailored to their chosen specialization track and expertise level. Built with Next.js 15, it features AI-powered content generation using Google's Genkit, Firebase authentication, and a modern UI powered by shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with App Router and React Server Components
- Server-side rendering for improved performance and SEO
- Client-side interactivity where needed using "use client" directive
- TypeScript for type safety across the application

**UI Framework**: shadcn/ui with Radix UI primitives
- Comprehensive component library for consistent design
- Tailwind CSS for styling with custom color scheme (teal primary, soft green accent)
- Dark mode support with HSL-based color system
- Responsive design with mobile-first approach

**State Management**:
- React hooks (useState, useEffect) for local component state
- Context API for authentication state (AuthContext)
- No external state management library needed due to server-first architecture

**Routing**:
- `/` - Welcome/landing page
- `/login` - User authentication
- `/signup` - User registration
- `/home` - Main application with onboarding flow and daily dose view

### Backend Architecture

**Server Actions**: Next.js server actions for API endpoints
- `generateDailyCardAction` in `src/app/actions.ts` handles AI card generation
- Server-side execution ensures API keys remain secure

**AI Integration**: Google Genkit framework
- Three defined flows for content manipulation:
  - `generate-daily-card`: Creates personalized learning cards based on track, level, and locale
  - `adjust-card-difficulty`: Modifies content complexity based on user performance
  - `summarize-card`: Simplifies explanations for beginner understanding
- Uses structured output with Zod schemas for type-safe AI responses
- Gemini 2.5 Flash model for content generation

**Authentication Flow**:
- Client-side auth state management with Firebase Auth SDK
- Auth guard implemented in AuthContext redirects unauthenticated users
- Protected routes check authentication status before rendering

### Data Models

**DailyCard Type**:
- Core content structure with title, term, definition, example, and why sections
- Embedded quiz with multiple choice or true/false questions
- Metadata including track, level, locale, and tags

**User Preferences**:
- Track selection (6 options: Cybersecurity, Networks, Cloud & DevOps, AI & ML, Software Engineering, Marketing)
- Level selection (Beginner, Intermediate, Advanced)
- Locale support (Arabic and English)

**Gamification Elements**:
- Streak counter (fire icon)
- Points system (coin icon)
- User profile with avatar

### Design Patterns

**Onboarding Flow**: Multi-step wizard pattern
- Step 1: Track selection with visual cards
- Step 2: Level selection with descriptive options
- Step 3: Daily dose view with generated content
- Query parameter support for re-entering onboarding

**Component Architecture**:
- Atomic design principles with reusable UI components
- Feature-specific components in `dose-wise` folder
- Separation of concerns between presentation and logic

**Error Handling**:
- Try-catch blocks in server actions with user-friendly error messages
- Loading states with skeleton components
- Alert components for displaying errors and success messages

## External Dependencies

**Authentication**: Firebase Authentication
- Email/password authentication
- User profile management (display name, photo URL)
- Client-side only initialization to prevent SSR issues

**AI Service**: Google Genkit with Google AI plugin
- Requires `GOOGLE_GENAI_API_KEY` environment variable
- Structured prompt engineering for consistent outputs
- Three specialized flows for different content operations

**UI Components**: 
- Radix UI primitives (@radix-ui/react-*)
- Lucide React for iconography
- Embla Carousel for potential carousel functionality
- React Hook Form with Zod for form validation
- Recharts for potential data visualization

**Styling**:
- Tailwind CSS with custom configuration
- CSS variables for theming (light/dark mode)
- Custom color palette (teal/green scheme)

**Development Environment**:
- Configured for Replit with custom dev origins (*.replit.dev, *.pike.replit.dev, *.picard.replit.dev, *.riker.replit.dev)
- Dev server runs on 0.0.0.0:5000 for Replit compatibility
- Remote image patterns allowed for placeholder services
- TypeScript with strict mode enabled but build errors ignored for development flexibility

**Deployment Considerations**:
- Environment variables needed:
  - `GOOGLE_GENAI_API_KEY`: Google AI API key for Genkit (required for AI card generation)
  - `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase web API key (optional, fallback hardcoded in firebase.ts)
- Port configuration defaults to 5000 with dynamic PORT variable support
- Production start script binds to 0.0.0.0 and respects PORT env var
- Firebase project ID: studio-2268895776-4703d
- Firebase storageBucket: studio-2268895776-4703d.appspot.com
- Authorized domains must be added in Firebase Console (Authentication → Settings → Authorized domains) for production deployment

## Recent Changes (September 30, 2025)

### Fresh GitHub Clone Import - September 30, 2025 (Latest)
**Replit Environment Setup Completed:**
- Installed all npm dependencies (946 packages) from fresh GitHub clone
- PostgreSQL database provisioned and schema pushed successfully using Drizzle
- Frontend workflow "Frontend Server" configured and running on port 5000 (0.0.0.0:5000)
- Added `*.janeway.replit.dev` to Next.js `allowedDevOrigins` for proper Replit proxy support
- All existing configuration preserved (Firebase auth, Google AI, TypeScript settings)

**Configuration Verified:**
- Next.js dev server properly configured with `-H 0.0.0.0 -p 5000` for Replit compatibility
- Next.js config includes `allowedDevOrigins` for Replit domains (pike, picard, riker, kirk, janeway)
- Remote image patterns configured for placeholder services (placehold.co, unsplash, picsum)

**Deployment Configuration:**
- Deployment target: autoscale (stateless web app)
- Build command: `npm run build`
- Start command: `npm start` (binds to 0.0.0.0:5000 with dynamic PORT env var support)

**Testing Results:**
- Application verified working - landing page loads correctly with DoseWise branding
- Server successfully compiles and serves pages (Ready in ~1.6s, compile time ~6s)
- No blocking errors detected, only expected Firebase hydration warning

### Gamification System Implementation - Completed
Added comprehensive gamification features to enhance learning engagement:

**New Features:**
1. **Levels System**
   - Questions stored in Firestore with level field (1-3 corresponding to Beginner, Intermediate, Advanced)
   - Users start at level 1 and unlock next level by earning sufficient XP
   - XP requirement: 100 XP per level

2. **XP, Hearts, and Streak Tracking**
   - User progress stored in Firestore under `users/{uid}` collection
   - Fields: xp, hearts (max 5), streak, currentLevel, answeredQuestions, wrongQuestions
   - Correct answer: +10 XP reward
   - Wrong answer: -1 heart and question marked for retry
   - Daily login increases streak by 1 (resets if skipped more than 1 day)

3. **Lesson Flow Logic**
   - Questions appear from lowest available level upwards
   - Previously answered questions (correct) are not repeated
   - Wrong answers are tracked and shown again until answered correctly
   - Smart question prioritization: retry wrong questions first, then new questions

4. **UI Components**
   - Hearts display (5 hearts shown at top, filled/empty based on remaining hearts)
   - XP progress bar showing current XP vs XP needed for next level
   - Streak counter with flame icon
   - XP counter with zap icon
   - All stats displayed in header with responsive design

5. **Data Architecture**
   - Firestore collections: `users` (progress) and `questions` (content)
   - Questions auto-saved to Firestore when AI generates them
   - Real-time progress updates after each answer
   - Toast notifications for feedback (correct +10 XP, incorrect -1 heart)

**Technical Implementation:**
- Created `src/lib/firestore.ts` with all Firestore utility functions
- Created `src/app/game-actions.ts` for server actions
- Created `src/components/dose-wise/game-stats.tsx` for UI components
- Updated Quiz component to handle answer submission and XP/hearts
- Updated Header to display GameStats and XPProgressBar
- Updated DailyCard and DailyDoseView to pass game progress
- Updated home page to initialize progress and handle answers

### Known Issues
- Harmless hydration warning in browser console due to Firebase auth SSR/client mismatch (does not affect functionality)

### Environment Variables Status
- ✅ `GOOGLE_GENAI_API_KEY`: Configured successfully - AI card generation is fully operational
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`: Using development key (hardcoded fallback in firebase.ts)
- ✅ `DATABASE_URL`: PostgreSQL database configured for development