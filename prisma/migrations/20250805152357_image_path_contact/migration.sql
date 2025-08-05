/*
  Warnings:

  - Added the required column `image_path` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."contact" ADD COLUMN     "image_path" TEXT NOT NULL;
