CREATE TYPE "public"."priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('TODO', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "priority" "priority" DEFAULT 'MEDIUM';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "status" "status" DEFAULT 'TODO';