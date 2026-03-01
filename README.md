# OverSight — Clarity Beyond the Bill

**HackIllinois 2026 · University of Illinois Urbana-Champaign**

> AI-powered medical bill analysis that helps patients find overcharges and fight back.

---

## The Team

**Sudarshan Krishna & Isheta Gupta**

Built in 36 hours at HackIllinois 2026.

### Tracks & Categories

| Type | Track |
|------|-------|
| General Admission | Best UI/UX Design |
| General Admission | Best Social Impact |
| Sponsor | Modal — AI Inspection Track |

---

## The Problem

Medical billing in the US is a mess — and not accidentally.

The average patient gets a bill full of CPT codes, line items that don't match what happened, and prices that vary wildly depending on who's asking. Studies suggest **80% of medical bills contain errors**, and over **$210 billion** is lost annually because of it. Most people just pay. Not because they can't afford to fight it, but because they have no idea where to start.

---

## What We Built

**OverSight** takes a medical bill, tears it apart, and tells you exactly what's wrong with it — in plain English.

```
Upload your bill  →  get a breakdown of every charge
→  see what's overpriced or miscoded  →  send a dispute letter
```

The whole thing takes under a minute.

---

## How It Works

| Step | What Happens |
|------|-------------|
| **1 · Upload** | We parse your PDF using OCR + AI to extract every charge, CPT code, and line item — even from scanned documents |
| **2 · Talk to Stella** | Our AI voice advocate walks you through the bill, asks about your visit, and uses your answers to contextualize the analysis |
| **3 · Analysis** | Your charges are benchmarked against CMS data and regional pricing to flag upcoding, duplicates, out-of-network errors, and above-market rates |
| **4 · Take Action** | You get a savings estimate, a risk breakdown, and a dispute email ready to send |

---

## Sponsor Integrations

### Modal — AI Inspection Track
Modal is the computational backbone of OverSight. We use it as our root agent AI, handling PDF parsing, OCR, and all heavy compute tasks. When a bill is uploaded, Modal spins up a serverless container, reads the medical document, identifies every charge, and flags areas where the patient is likely being overcharged. Nearly all of our AI analysis pipeline runs through Modal.

### ElevenLabs — Voice Advocate
We use ElevenLabs to power Stella, our AI medical advocate. Think of it as having a billing-savvy lawyer you can actually talk to — Stella listens to your situation, explains what the charges mean, and helps you understand where you may have been overcharged. No medical jargon, no confusion. Just a clear conversation about what's on your bill.

### SuperMemory — Persistent Context
Every time a bill is analyzed, we push the extracted data into SuperMemory. This serves two purposes: first, it gives our AI advocate full context about the user's current situation during the session. Second, it enables memory across sessions — if a user comes back a week later with a follow-up bill or question, Stella already knows their history. SuperMemory is what makes OverSight feel like a continuous advocate rather than a one-off tool.

### OpenAI — Dispute Generation
We use OpenAI's API for our complaint email generator. Once the analysis is complete, OpenAI takes the flagged charges and produces a fully formatted, insurance-ready dispute letter the user can send directly to their provider or insurer. Clear, professional, and built around the specific errors detected in their bill.

### Cloudflare — Security & Compliance
Medical data is sensitive by definition, and HIPAA compliance isn't optional. We use Cloudflare for edge security, traffic encryption, and protecting data in transit. Cloudflare sits between the user and our infrastructure, ensuring that bill data is never exposed and that the platform holds up to the security standards healthcare applications require.

---

## Architecture

```
Browser / Next.js Frontend
         ↓
  API Routes (TypeScript)
         ↓
  Modal Serverless Compute          ←   Root Agent AI / OCR / PDF Parsing
         ↓
  Python AI Analysis Engine
         ↓
  Healthcare Benchmark Models       ←   CMS.gov Datasets
         ↓
  Structured JSON Insight
         ↓           ↓
SuperMemory Store   OpenAI Dispute Generator
         ↓
  React State + ElevenLabs Voice Layer
```

---

## Tech Stack

### Frontend
`Next.js 15` `React` `TailwindCSS` `Framer Motion` `Radix UI`

### Backend
`FastAPI` `Modal Serverless` `Neon Postgres` `Drizzle ORM`

### AI & Infrastructure
`OpenAI` `Anthropic` `Google Gemini` `ElevenLabs` `SuperMemory` `Cloudflare` `Clerk`

---

## What Was Hard

**Parsing medical PDFs** is genuinely painful. There's no standard format — some are digital, some are scanned, some are structured tables, some are just walls of text. Getting reliable CPT code extraction across all of them took a lot of iteration.

**Syncing voice with analysis** was also tricky. Stella collects context in real time, but the analysis pipeline needs that context before it can run. We built a state handoff layer between ElevenLabs and Modal to make this work cleanly.

**Maintaining memory across sessions** without storing raw bill data persistently required careful integration with SuperMemory — pushing only what's needed, in a format the voice agent can actually reason over.

---

## Privacy & Compliance

- No voice recordings stored
- Bill data processed statelessly in isolated Modal containers
- Cloudflare encryption on all data in transit — HIPAA-conscious by design
- Auth handled entirely by Clerk
- Nothing sensitive touches a model's training pipeline

---

## Running It Locally

```bash
git clone <repo-url>
cd oversight-ui
npm install
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
DATABASE_URL=your_database_url
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key
NEXT_PUBLIC_MODAL_ANALYZE_PDF_URL=your_modal_endpoint
SUPERMEMORY_KEY=your_key
OPENAI_API_KEY=your_key
```

Open `http://localhost:3000`

---

## The Bigger Picture

Medical billing is confusing by design. Hospitals and insurers have entire departments dedicated to maximizing what they collect. Patients have nothing.

OverSight is our attempt to change that ratio — even a little.

---

*Built at HackIllinois 2026 · University of Illinois Urbana-Champaign*  
*Sudarshan Krishna & Isheta Gupta*
