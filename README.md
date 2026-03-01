# OverSight — Clarity Beyond the Bill

**HackIllinois 2026 · University of Illinois Urbana-Champaign**

> AI-powered medical bill analysis that helps patients find overcharges and fight back.

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
| **2 · Talk to Stella** | Our AI voice assistant walks you through the bill, asks about your visit, and uses your answers to contextualize the analysis |
| **3 · Analysis** | Your charges are benchmarked against CMS data and regional pricing to flag upcoding, duplicates, out-of-network errors, and above-market rates |
| **4 · Take Action** | You get a savings estimate, a risk breakdown, and a dispute email ready to send |

---

## Tech Stack

### Frontend
`Next.js 15` `React` `TailwindCSS` `Framer Motion` `Radix UI`

### Backend
`FastAPI` `Modal Serverless` `Neon Postgres` `Drizzle ORM`

### AI & Infrastructure
`OpenAI` `Anthropic` `Google Gemini` `Vapi` `SuperMemory` `Cloudflare` `Clerk`

---

## Architecture

```
Browser / Next.js Frontend
         ↓
  API Routes (TypeScript)
         ↓
  Modal Serverless Compute
         ↓
  Python AI Analysis Engine
         ↓
  Healthcare Benchmark Models   ←   CMS.gov Datasets
         ↓
  Structured JSON Insight
         ↓
  React State + Vapi Voice Layer
```

---

## What Was Hard

**Parsing medical PDFs** is genuinely painful. There's no standard format — some are digital, some are scanned, some are structured tables, some are just walls of text. Getting reliable CPT code extraction across all of them took a lot of iteration.

**Syncing voice with analysis** was also tricky. Stella collects context in real time, but the analysis pipeline needs that context before it can run. We built a state handoff layer between Vapi and Modal to make this work cleanly.

---

## Privacy

- No voice recordings stored
- Bill data processed statelessly in isolated serverless containers
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
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_key
NEXT_PUBLIC_MODAL_ANALYZE_PDF_URL=your_modal_endpoint
SUPERMEMORY_KEY=your_key
```

Open `http://localhost:3000`

---

## The Bigger Picture

Medical billing is confusing by design. Hospitals and insurers have entire departments dedicated to maximizing what they collect. Patients have nothing.

OverSight is our attempt to change that ratio — even a little.

---

*Built at HackIllinois 2026 · University of Illinois Urbana-Champaign*
