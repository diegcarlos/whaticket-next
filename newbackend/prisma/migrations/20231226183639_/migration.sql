/*
  Warnings:

  - You are about to alter the column `createdAt` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `updatedAt` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `contactcustomfields` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `messages` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;
