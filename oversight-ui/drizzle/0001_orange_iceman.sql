CREATE TABLE "narrative_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"theme" text NOT NULL,
	"description" text,
	"first_appeared_session" integer,
	"last_reinforced_session" integer,
	"strength" integer DEFAULT 1,
	"examples" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"snapshot_type" text NOT NULL,
	"profile_data" json NOT NULL,
	"total_sessions" integer DEFAULT 0,
	"total_projects" integer DEFAULT 0,
	"headline_truth" text,
	"founder_type" text,
	"generated_at" timestamp DEFAULT now(),
	"data_hash" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_evolution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"session_number" integer NOT NULL,
	"evolution_type" text,
	"from_value" text,
	"to_value" text,
	"reason" text,
	"impact" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "your_story" text;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "story_version" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "your_truth" text;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "what_drives_you" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "turning_point" json;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "the_doubt" json;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "the_breakthrough" json;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "key_quotes" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "founder_dna" text;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "personality_traits" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "tell_it_your_way" json DEFAULT '{"lightning":"","dinnerParty":"","websiteBio":"","investorPitch":""}'::json;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "narrative_depth" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "emotional_openness" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "founder_narratives" ADD COLUMN "clarity_score" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "founder_projects" ADD COLUMN "story_depth" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "founder_projects" ADD COLUMN "last_mood" text;