CREATE TABLE "projects" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "architecture" TEXT NOT NULL,
  "challenges" JSONB NOT NULL,
  "stack" JSONB NOT NULL,
  "stack_reasoning" TEXT NOT NULL,
  "github_url" TEXT,
  "live_url" TEXT,
  "thumbnail" TEXT,
  "gif_demo" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

CREATE TABLE "project_media" (
  "id" TEXT NOT NULL,
  "project_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "alt" TEXT NOT NULL,
  "order_index" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "project_media_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skills" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "icon" TEXT,
  "level" INTEGER NOT NULL,
  "reasoning" TEXT NOT NULL,
  "applied_in" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "experiences" (
  "id" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "start_date" TIMESTAMP(3) NOT NULL,
  "end_date" TIMESTAMP(3),
  "technologies" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "messages" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_visits" (
  "id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "recruiter_mode" BOOLEAN NOT NULL DEFAULT false,
  "duration" INTEGER,
  "country" TEXT,
  "device" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_visits_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_visits_session_id_key" ON "user_visits"("session_id");

CREATE TABLE "dialogue_logs" (
  "id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "dialogue_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dialogue_logs_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_fkey"
  FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dialogue_logs" ADD CONSTRAINT "dialogue_logs_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "user_visits"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
