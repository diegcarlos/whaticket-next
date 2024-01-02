/*
  Warnings:

  - You are about to drop the column `usersId` on the `queues` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappsId` on the `queues` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `queues` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updatedAt` on the `queues` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

*/
-- DropForeignKey
ALTER TABLE `queues` DROP FOREIGN KEY `queues_whatsappsId_fkey`;

-- DropForeignKey
ALTER TABLE `userqueues` DROP FOREIGN KEY `userqueues_queueId_fkey`;

-- DropIndex
DROP INDEX `queues_idGroupQueue_fkey` ON `queues`;

-- DropIndex
DROP INDEX `queues_usersId_fkey` ON `queues`;

-- AlterTable
ALTER TABLE `queues` DROP COLUMN `usersId`,
    DROP COLUMN `whatsappsId`,
    MODIFY `createdAt` DATETIME(0) NOT NULL,
    MODIFY `updatedAt` DATETIME(0) NOT NULL;

-- AddForeignKey
ALTER TABLE `queues` ADD CONSTRAINT `queues_idGroupQueue_fkey` FOREIGN KEY (`idGroupQueue`) REFERENCES `groupQueue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
