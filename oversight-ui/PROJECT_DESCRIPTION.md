# OverSight - Project Documentation

## 🎯 Project Overview

**OverSight** is a voice-first founder storytelling platform designed to help startup entrepreneurs discover, articulate, and refine their authentic narratives through AI-powered conversations. Unlike traditional text-based journaling or pitch deck tools, OverSight leverages the power of voice to unlock genuine emotion, spontaneous insights, and the raw authenticity that makes compelling founder stories.

### Current Status: Production-Grade MVP+

OverSight is currently a **production-grade MVP+** with core functionality fully implemented and live. The platform successfully demonstrates the voice-to-narrative pipeline with real users actively using the system to develop their founder stories.

### Core Mission

Transform the way founders tell their stories by making narrative discovery as natural as having a conversation with a trusted friend, while providing AI-powered insights that help them see patterns, themes, and compelling moments they might have missed.

### Current Live Pages & Functionality

1. **`/home`** - Main dashboard for project management
2. **`/record/[projectId]`** - Voice recording sessions with VAPI integration
3. **`/projects/[id]`** - Project details and narrative viewing
4. **`/sessions/[id]`** - Individual session analysis and insights

### Current Limitations

- **No public profile pages** - Users cannot share their stories publicly yet
- **Landing page needs development** - Entry point for new users requires building
- **Memory architecture limitations** - No cross-session context retention in AI conversations

## 🏗️ Technical Architecture

### **Technology Stack**

**Frontend:**

- **Next.js 15.3.3** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript/JavaScript** - Primary languages
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion 12.16.0** - Animation and transitions
- **Shadcn/ui** - Component library built on Radix UI

**Backend & Database:**

- **PostgreSQL** - Primary database
- **Drizzle ORM 0.44.1** - Type-safe database toolkit
- **Neon Database** - Serverless PostgreSQL hosting

**Authentication & User Management:**

- **Clerk 6.11.1** - Authentication and user management
- **Middleware protection** - Route-based authentication

**AI & Voice Processing:**

- **Google Gemini 1.5 Flash** - AI narrative analysis and generation (not 2.0)
- **VAPI.ai** - Voice conversation interface
- **OpenAI GPT-4** - Conversation model within VAPI
- **Deepgram Nova-3** - Speech-to-text transcription
- **ElevenLabs** - Text-to-speech synthesis

**Deployment & Infrastructure:**

- **Vercel** - Hosting and deployment
- **Environment-based configuration**

## 🎨 User Experience Flow

### **1. Landing Experience**

- **Currently needs development** - The landing page for new user onboarding has not been built yet
- **Direct access via authentication** - Users currently access the platform through Clerk authentication

### **2. Dashboard Experience (`/home`)**

Users are greeted with a clean, organized dashboard that displays:

- **Active projects** - Ongoing storytelling projects with progress indicators
- **Recent sessions** - Latest voice recording sessions with timestamps
- **Quick actions** - Start new project, continue existing sessions
- **Project management** - Create, edit, and organize storytelling projects

### **3. Voice Recording Session (`/record/[projectId]`)**

The core experience follows this flow:

#### **Initialization Phase:**

1. **Project context loading** - Fetches previous session data if continuing a project
2. **AI prompt generation** - Creates personalized conversation starters
3. **VAPI connection** - Establishes voice connection with retry logic
4. **System prompt preparation** - Configures AI personality and conversation style

#### **Active Recording Phase:**

- **Real-time VAPI integration** with voice conversation AI
- **Live transcription display** showing current questions/responses
- **Session timer** tracking conversation duration
- **Connection state management** (disconnected/connecting/connected/error)
- **Auto-backup functionality** for data safety

#### **Conversation Management:**

- **GPT-4 powered conversations** through VAPI interface
- **Natural dialogue flow** with follow-up questions
- **Contextual conversation guidance**
- **Real-time voice processing** with immediate AI responses

#### **Current Limitations:**

- **No memory across sessions** - Each recording starts fresh without context from previous sessions
- **Limited cross-session context** - AI doesn't retain learnings from past conversations

#### **Session Termination:**

- **Confirmation dialog** to prevent accidental endings
- **Graceful connection closure**
- **Immediate processing trigger**

### **4. AI Analysis & Processing**

#### **Narrative Generation Pipeline:**

1. **Transcript processing** - Clean and structure conversation data
2. **Context integration** - Combine with session-specific data
3. **AI analysis** using Gemini 1.5 Flash with sophisticated prompts

#### **AI Prompt System (`utils/GeminiPrompt.js`):**

The system uses a carefully crafted prompt that instructs Gemini to:

- **Analyze emotional arcs** and identify turning points in the founder's story
- **Extract recurring themes** and patterns across the conversation
- **Generate compelling one-liners** and elevator pitch elements
- **Identify standout quotes** and memorable moments
- **Suggest next conversation directions** for continued exploration
- **Create structured narratives** with clear emotional and thematic organization

#### **Current AI Limitations:**

- **Session-isolated analysis** - No memory or context from previous sessions
- **Single-session insights** - Analysis is limited to current conversation only
- **No longitudinal tracking** - Patterns across multiple sessions not detected

#### **Data Structure Generated:**

```json
{
  "sessionReflection": "Emotional journey summary",
  "founderBio": "Authentic founder description",
  "oneLiner": "Project essence in one sentence",
  "elevatorPitch": "30-second compelling pitch",
  "whyNowWhyMe": "Timing and founder-market fit",
  "recurringThemes": ["theme1", "theme2"],
  "standoutMoments": ["moment1", "moment2"],
  "keyQuote": {
    "quote": "Most impactful statement",
    "context": "When and why it was said"
  },
  "emotionalTone": "Overall session mood",
  "nextPrompt": "Suggested follow-up conversation"
}
```

### **5. Story Analysis & Reports (`/projects/[id]` & `/sessions/[id]`)**

After AI processing, users can access:

#### **Project View (`/projects/[id]`):**

- **Project overview** with consolidated insights across all sessions
- **Session timeline** showing progression and development
- **Key themes and patterns** identified across conversations
- **Project-level narrative synthesis**

#### **Session View (`/sessions/[id]`):**

- **Individual session analysis** with specific insights
- **AI-generated narrative** from that conversation
- **Emotional highlights** and key moments
- **Thematic breakdown** of topics covered
- **Session-specific quotes** and standout phrases

#### **Current Limitations:**

- **No public sharing** - Stories remain private to the user
- **Limited cross-session synthesis** - Connections between sessions not automatically made
- **No export functionality** - Reports cannot be downloaded or shared externally

## 📊 Database Schema & Data Model

### **Core Tables:**

#### **userProfiles**

```sql
- id (serial, primary key)
- clerkUserId (varchar, unique identifier)
- email, name, username (varchar fields)
- imageUrl (text, profile picture)
- plan (varchar, subscription level - default: "free")
- isActive (boolean, account status)
- hasOnboarded (boolean, setup completion)
- interviewCredits (integer, usage limits - default: 3)
- bio (text, optional OverSight)
- createdAt (timestamp)
```

#### **founderProjects**

```sql
- id (uuid, primary key)
- userId (text, foreign key to user)
- name (text, project name)
- description (text, project overview)
- currentStage (text, development phase - default: "idea")
- lastSessionSummary (text, most recent insights)
- sessionCount (integer, total sessions - default: 0)
- isPublic (boolean, sharing status - default: false)
- createdAt, updatedAt (timestamps)
```

#### **founderNarratives**

```sql
- id (uuid, primary key)
- sessionId (text, unique session identifier)
- userId (text, foreign key to user)
- projectId (uuid, foreign key to project)
- sessionNumber (integer, sequence in project)
- sessionType (text, conversation category - default: "general")
- transcript (text, full conversation record)
- feedbackJson (json, AI analysis results)
- sessionTitle (text, generated title)
- projectName (text, denormalized for quick access)
- oneLiner (text, key project description)
- quote (text, standout moment)
- tags (json array, thematic labels)
- mood (text, emotional classification)
- createdAt (timestamp)
```

## 🤖 AI Integration & Prompt Engineering

### **Voice Conversation System (VAPI + OpenAI)**

The conversation engine uses a sophisticated multi-layered approach:

#### **System Persona:**

- **Emotionally intelligent** - Recognizes and responds to emotional cues
- **Curious and empathetic** - Asks follow-up questions that dig deeper
- **Non-judgmental** - Creates safe space for vulnerability
- **Therapeutically trained** - Uses coaching techniques to unlock insights

#### **Dynamic Prompt Generation:**

```javascript
// New project prompts focus on:
- Origin story and initial inspiration
- Problem identification and personal connection
- Early vision and motivation

// Continuing session prompts leverage:
- Previous session summaries
- Identified themes and patterns
- Emotional progression tracking
- Specific follow-up questions based on prior insights
```

### **Narrative Analysis System (Google Gemini)**

#### **Advanced Analysis Pipeline:**

1. **Emotional Arc Detection** - Identifies highs, lows, and turning points
2. **Theme Extraction** - Finds recurring patterns across sessions
3. **Authenticity Assessment** - Distinguishes genuine moments from rehearsed content
4. **Story Structure Recognition** - Maps narrative to compelling frameworks
5. **Quote Mining** - Identifies the most impactful statements
6. **Next Step Prediction** - Suggests productive conversation directions

#### **Context-Aware Processing:**

- **Session history integration** - Builds on previous conversations
- **Project stage adaptation** - Adjusts analysis based on development phase
- **Founder personality recognition** - Adapts to individual communication styles
- **Industry-specific insights** - Recognizes sector-specific challenges and opportunities

## 🔄 User Workflows & Use Cases

### **Primary User Journeys:**

#### **New Founder - First Session:**

1. **Discovery** - Land on marketing page, see value proposition
2. **Sign up** - Quick Clerk authentication
3. **Onboarding** - Brief intro to voice-first approach
4. **First session** - 15-30 minute exploratory conversation
5. **Analysis** - Receive first narrative insights
6. **Hook moment** - See their story reflected back with new clarity

#### **Returning Founder - Project Evolution:**

1. **Dashboard check** - Review previous insights and progress
2. **Context loading** - System prepares based on project history
3. **Targeted session** - Conversation builds on previous themes
4. **Pattern recognition** - AI identifies evolving narrative threads
5. **Growth visualization** - See story development over time

#### **Advanced User - Story Refinement:**

1. **Multi-project management** - Work on different ventures
2. **Theme exploration** - Deep dive into specific narrative elements
3. **Public sharing** - Create shareable story versions
4. **Feedback integration** - Iterate based on audience response

### **Secondary Use Cases:**

#### **Investor Pitch Preparation:**

- Extract compelling elevator pitches
- Identify strongest emotional hooks
- Practice authentic storytelling
- Build confidence through repetition

#### **Team Alignment:**

- Share founder narrative with team members
- Create consistent company story
- Onboard new team members with authentic context

#### **Content Creation:**

- Generate authentic social media content
- Create blog post foundations
- Develop speaking engagement material

## 🎛️ Technical Implementation Details

### **Frontend Architecture:**

#### **App Router Structure:**

```
app/
├── (auth)/           # Authentication routes
├── (protected)/      # Authenticated user areas
│   ├── (main)/      # Main application features
│   └── record/      # Voice recording sessions
├── api/             # Backend API routes
└── u/               # Public user profiles
```

#### **State Management:**

- **React hooks** for local component state
- **URL-based routing** for navigation state
- **localStorage** for session backup and recovery
- **Real-time updates** via VAPI event listeners

#### **Component Architecture:**

- **Shared UI components** via shadcn/ui
- **Feature-specific components** in logical groupings
- **Error boundaries** for graceful failure handling
- **Loading states** and optimistic updates

### **Backend API Design:**

#### **RESTful Endpoints:**

```
POST /api/save-narrative    # Store session results
GET  /api/projects          # List user projects
GET  /api/projects/[id]     # Project details
POST /api/projects          # Create new project
GET  /api/sessions/[id]     # Session details
```

#### **Data Flow:**

1. **Voice session** → VAPI → Transcript
2. **Transcript** → Gemini AI → Analysis
3. **Analysis** → Database → Structured storage
4. **UI Updates** → Real-time state synchronization

### **Voice Processing Pipeline:**

#### **VAPI Configuration:**

```javascript
{
  transcriber: {
    provider: "deepgram",
    model: "nova-3",        // High-accuracy speech recognition
    language: "en-US"
  },
  voice: {
    provider: "11labs",
    voiceId: "UgBBYS2sOqTuMpoF3BR0"  // Warm, professional voice
  },
  model: {
    provider: "openai",
    model: "gpt-4",         // Conversation intelligence
    messages: [systemPrompt]
  }
}
```

#### **Real-time Features:**

- **Live transcription** display
- **Audio level visualization**
- **Connection status indicators**
- **Auto-reconnection** with exponential backoff
- **Session duration tracking**

## 🚀 Deployment & DevOps

### **Environment Configuration:**

- **Development** - Local Next.js with hot reload
- **Staging** - Vercel preview deployments
- **Production** - Vercel with custom domain

### **Environment Variables:**

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
NEXT_PUBLIC_DRIZZLE_DB_URL=

# AI Services
NEXT_PUBLIC_VAPI_API_KEY=
GOOGLE_GEMINI_API_KEY=

# Additional services as needed
```

### **Database Management:**

- **Drizzle migrations** for schema changes
- **Automated backups** via Neon
- **Connection pooling** for performance

## 📈 Current Business Model & Implementation Status

### **Current User Access:**

- **Limited beta** - Production-grade MVP+ with active users
- **No formal pricing** - Currently in validation phase
- **Direct user feedback** driving feature prioritization

### **Proven Value Proposition:**

1. **Voice-first discovery** - Users report deeper insights compared to written reflection
2. **AI-powered analysis** - Gemini provides perspectives users wouldn't discover alone
3. **Structured narrative development** - Clear progression from conversation to story
4. **Emotional authenticity** - Voice captures nuance lost in text

### **Current Limitations Impacting Scale:**

- **No landing page** - Barrier to new user acquisition
- **No public profiles** - Limited viral/sharing potential
- **Memory limitations** - AI doesn't build knowledge across sessions
- **Manual onboarding** - No self-service user journey

## 🎯 Technical Roadmap & Priority Features

### **Immediate Priorities (MVP+ → v1.0):**

1. **Landing page development** - Enable organic user acquisition
2. **Cross-session memory** - AI context retention across conversations
3. **Public profile pages** - Enable story sharing and discovery
4. **Enhanced AI prompts** - Improved narrative synthesis

### **Near-term Features (v1.0 → v2.0):**

- **Export functionality** - PDF/text story reports
- **Mobile optimization** - Responsive design improvements
- **Advanced project management** - Better organization tools
- **Integration APIs** - Connect with pitch deck/presentation tools

### **Medium-term Vision (v2.0+):**

- **Team collaboration** - Shared projects and feedback
- **Industry-specific templates** - Tailored conversation flows
- **Analytics dashboard** - Progress tracking and insights
- **Mobile app** - Native iOS/Android experience
- **Community features** for founder story sharing
- **Video storytelling** capabilities

### **Long-term Goals:**

- **Multi-language support**
- **Enterprise tools** for accelerators and VCs
- **API platform** for third-party integrations
- **Story marketplace** for content creators

## 🔒 Security & Privacy

### **Data Protection:**

- **End-to-end encryption** for voice data
- **GDPR compliance** for EU users
- **User data control** - easy export/deletion
- **Secure authentication** via Clerk

### **Privacy Features:**

- **Granular sharing controls**
- **Anonymous session options**
- **Data retention policies**
- **Opt-out mechanisms**

## 🎨 Design Philosophy

### **Voice-First Principles:**

- **Natural conversation flow** over rigid questionnaires
- **Emotional authenticity** over polished perfection
- **Iterative discovery** over one-time extraction

## 📋 Current System Status Summary

### **✅ Fully Implemented & Live:**

1. **Complete authentication system** with Clerk integration
2. **Working voice recording sessions** via VAPI with GPT-4
3. **AI narrative analysis** using Gemini 1.5 Flash
4. **Database storage** with PostgreSQL and Drizzle ORM
5. **Project management** - create, view, and organize storytelling projects
6. **Session management** - individual conversation tracking and analysis
7. **Real-time voice processing** with transcription and AI responses
8. **Production deployment** on Vercel with active users

### **⚠️ Current Limitations:**

1. **No landing page** - New user acquisition barrier
2. **No public profiles** - Cannot share stories publicly
3. **No cross-session memory** - AI starts fresh each conversation
4. **No story export** - Cannot download or share reports externally
5. **Limited mobile optimization** - Primarily desktop-focused

### **🏗️ Architecture Strengths:**

- **Scalable tech stack** - Next.js 15, PostgreSQL, modern tooling
- **Robust voice pipeline** - VAPI, Deepgram, ElevenLabs integration
- **Type-safe database** - Drizzle ORM with proper schema design
- **Secure authentication** - Clerk with middleware protection
- **AI flexibility** - Multiple AI providers for different use cases

### **📊 Technical Metrics:**

- **4 live page routes** successfully handling user traffic
- **Real-time voice processing** with sub-second response times
- **Persistent data storage** with relational database design
- **Production-grade error handling** and connection management
- **Modern development stack** with TypeScript, Tailwind, and component libraries

OverSight represents a **successfully implemented MVP+** that proves the voice-to-narrative concept while maintaining a clear technical roadmap for scaling to a full v1.0 product.

- **Human connection** enhanced by AI insights

### **User Experience Priorities:**

1. **Effortless onboarding** - Start talking immediately
2. **Trust building** - Safe space for vulnerability
3. **Immediate value** - Insights from first session
4. **Long-term growth** - Story evolution over time

---

**OverSight** represents a fundamental shift in how founders approach narrative development - from a laborious writing exercise to an engaging conversation that naturally unlocks the authentic stories that make businesses compelling and memorable.

The platform's unique combination of voice-first interaction, AI-powered analysis, and iterative refinement creates an experience that is both emotionally rewarding and practically valuable for founders at any stage of their journey.
