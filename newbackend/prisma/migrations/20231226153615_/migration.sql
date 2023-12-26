/*
  Warnings:

  - You are about to alter the column `createdAt` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `updatedAt` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `queues` ADD COLUMN `usersId` INTEGER NULL;

-- AlterTable
ALTER TABLE `tickets` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `queues` ADD CONSTRAINT `queues_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
