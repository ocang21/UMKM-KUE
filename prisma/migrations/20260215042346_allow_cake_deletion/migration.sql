-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_cakeId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "cakeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE SET NULL ON UPDATE CASCADE;
