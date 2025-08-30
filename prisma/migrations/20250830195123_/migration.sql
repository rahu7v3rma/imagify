/*
  Warnings:

  - You are about to drop the column `subscription_plan_name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "subscription_plan_name",
ADD COLUMN     "subscription_plan_id" TEXT;
