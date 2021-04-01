/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[addressId]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_addressId_unique" ON "User"("addressId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
