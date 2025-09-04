/*
  Warnings:

  - You are about to drop the column `order_id` on the `order` table. All the data in the column will be lost.
  - Added the required column `payment_link_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."order" DROP COLUMN "order_id",
ADD COLUMN     "payment_link_id" TEXT NOT NULL;
