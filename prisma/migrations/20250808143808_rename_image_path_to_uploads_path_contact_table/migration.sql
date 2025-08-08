/*
  Warnings:

  - You are about to drop the column `image_path` on the `contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."contact" DROP COLUMN "image_path",
ADD COLUMN     "uploads_path" TEXT;
