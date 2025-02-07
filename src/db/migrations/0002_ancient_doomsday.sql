ALTER TABLE "tasks" ALTER COLUMN "priority" SET DEFAULT 'LOW';--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "status";--> statement-breakpoint
DROP TYPE "public"."status";