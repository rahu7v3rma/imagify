/*
  Warnings:

  - You are about to drop the column `uploads_path` on the `contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."contact" DROP COLUMN "uploads_path",
ADD COLUMN     "base_64_string" TEXT;
