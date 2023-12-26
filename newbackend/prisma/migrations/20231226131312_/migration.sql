/*
  Warnings:

  - You are about to alter the column `battery` on the `whatsapps` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- AlterTable
ALTER TABLE `contacts` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `whatsapps` MODIFY `battery` INTEGER NULL;
