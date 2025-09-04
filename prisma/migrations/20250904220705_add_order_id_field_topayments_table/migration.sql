-- AlterTable
ALTER TABLE "public"."order" ADD COLUMN     "order_id" TEXT,
ALTER COLUMN "payment_link_id" DROP NOT NULL;
