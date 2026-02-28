// utils/schema.js

import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  json,
  uuid,
} from "drizzle-orm/pg-core";

// 🧑 USER PROFILES
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(), // for public profile like /u/username
  imageUrl: text("image_url"),
  plan: varchar("plan", { length: 50 }).default("free"),
  isActive: boolean("is_active").default(true),
  hasOnboarded: boolean("has_onboarded").default(false),
  interviewCredits: integer("interview_credits").default(3),
  bio: text("bio"), // optional backstory bio
  createdAt: timestamp("created_at").defaultNow(),
});

// 📁 FOUNDER PROJECTS
export const founderProjects = pgTable("founder_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  currentStage: text("current_stage").default("idea"), // idea, validating, building, launched, growing, pivoting
  lastSessionSummary: text("last_session_summary"),
  sessionCount: integer("session_count").default(0),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // New fields for richer project context
  storyDepth: integer("story_depth").default(1), // 1-5 scale of narrative richness
  lastMood: text("last_mood"), // carry forward the emotional state
});

// 📝 FOUNDER NARRATIVES (UPDATED)
export const founderNarratives = pgTable("founder_narratives", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: text("user_id").notNull(),
  projectId: uuid("project_id").notNull(),
  sessionNumber: integer("session_number").default(1),
  sessionType: text("session_type").default("general"),
  transcript: text("transcript").notNull(),
  feedbackJson: json("feedback_json").notNull(), // Keep for backward compatibility

  // Basic session info
  sessionTitle: text("session_title"),
  projectName: text("project_name"),
  mood: text("mood"),
  tags: json("tags").default([]),
  createdAt: timestamp("created_at").defaultNow(),

  // 📖 YOUR STORY - The main narrative
  yourStory: text("your_story"), // The beautifully crafted 3-4 paragraph narrative
  storyVersion: integer("story_version").default(1), // Track story evolution

  // 💫 THE ESSENCE
  yourTruth: text("your_truth"), // One powerful line that captures their why
  whatDrivesYou: json("what_drives_you").default([]), // Array of 2-3 core themes with descriptions

  // 🔥 MOMENTS THAT MATTERED
  turningPoint: json("turning_point"), // {moment: "text", context: "when/why", sessionRef: number}
  theDoubt: json("the_doubt"), // {moment: "text", context: "when/why", overcame: boolean}
  theBreakthrough: json("the_breakthrough"), // {moment: "text", impact: "text", sessionRef: number}
  keyQuotes: json("key_quotes").default([]), // Array of powerful quotes with context

  // 🧬 FOUNDER DNA
  founderDNA: text("founder_dna"), // Human paragraph about who they are
  personalityTraits: json("personality_traits").default([]), // Detected traits over time

  // 📢 TELL IT YOUR WAY
  tellItYourWay: json("tell_it_your_way").default({
    lightning: "", // 15 words
    dinnerParty: "", // 2 sentences
    websiteBio: "", // Professional paragraph
    investorPitch: "", // Optional, only if they want it
  }),

  // Evolution tracking
  narrativeDepth: integer("narrative_depth").default(1), // 1-10 scale
  emotionalOpenness: integer("emotional_openness").default(1), // 1-10 scale
  clarityScore: integer("clarity_score").default(1), // 1-10 scale

  // Legacy fields (keeping for backward compatibility)
  oneLiner: text("one_liner"), // Will map to yourTruth
  quote: text("quote"), // Will map to keyQuotes[0]
});

// 🎭 STORY EVOLUTION TRACKING (NEW TABLE)
export const storyEvolution = pgTable("story_evolution", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  sessionNumber: integer("session_number").notNull(),
  evolutionType: text("evolution_type"), // "truth_refined", "theme_emerged", "breakthrough", "pivot"
  fromValue: text("from_value"),
  toValue: text("to_value"),
  reason: text("reason"), // Why this evolution happened
  impact: text("impact"), // How it affected their story
  createdAt: timestamp("created_at").defaultNow(),
});

// 🌟 NARRATIVE THEMES (NEW TABLE)
export const narrativeThemes = pgTable("narrative_themes", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  theme: text("theme").notNull(),
  description: text("description"),
  firstAppeared: integer("first_appeared_session"),
  lastReinforced: integer("last_reinforced_session"),
  strength: integer("strength").default(1), // 1-10, how prominent this theme is
  examples: json("examples").default([]), // Specific quotes/moments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 📸 PROFILE SNAPSHOTS (NEW TABLE)
export const profileSnapshots = pgTable("profile_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  snapshotType: text("snapshot_type").notNull(), // "latest" or "previous"

  // Complete profile data as JSON
  profileData: json("profile_data").notNull(), // Full profile object from API

  // Metadata for quick access
  totalSessions: integer("total_sessions").default(0),
  totalProjects: integer("total_projects").default(0),
  headlineTruth: text("headline_truth"),
  founderType: text("founder_type"),

  // Tracking
  generatedAt: timestamp("generated_at").defaultNow(),
  dataHash: text("data_hash"), // To detect if profile actually changed

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
