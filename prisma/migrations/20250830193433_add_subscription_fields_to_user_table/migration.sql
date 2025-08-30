-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "subscription_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscription_credit_reset_date" TIMESTAMP(6),
ADD COLUMN     "subscription_plan_name" TEXT;
