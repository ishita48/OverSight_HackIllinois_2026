CREATE TABLE "founder_narratives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text NOT NULL,
	"project_id" uuid NOT NULL,
	"session_number" integer DEFAULT 1,
	"session_type" text DEFAULT 'general',
	"transcript" text NOT NULL,
	"feedback_json" json NOT NULL,
	"session_title" text,
	"project_name" text,
	"one_liner" text,
	"quote" text,
	"tags" json DEFAULT '[]'::json,
	"mood" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "founder_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"current_stage" text DEFAULT 'idea',
	"last_session_summary" text,
	"session_count" integer DEFAULT 0,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"email" varchar(255),
	"name" varchar(255),
	"username" varchar(255),
	"image_url" text,
	"plan" varchar(50) DEFAULT 'free',
	"is_active" boolean DEFAULT true,
	"has_onboarded" boolean DEFAULT false,
	"interview_credits" integer DEFAULT 3,
	"bio" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_profiles_username_unique" UNIQUE("username")
);
