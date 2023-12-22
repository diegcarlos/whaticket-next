/*
  Warnings:

  - You are about to drop the column `queuesId` on the `groupqueue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `groupqueue` DROP FOREIGN KEY `groupQueue_queuesId_fkey`;

-- AlterTable
ALTER TABLE `groupqueue` DROP COLUMN `queuesId`;

-- AlterTable
ALTER TABLE `queues` ADD COLUMN `idGroupQueue` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `queues` ADD CONSTRAINT `queues_idGroupQueue_fkey` FOREIGN KEY (`idGroupQueue`) REFERENCES `groupQueue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
