-- DropForeignKey
ALTER TABLE `queues` DROP FOREIGN KEY `queues_idGroupQueue_fkey`;

-- AlterTable
ALTER TABLE `queues` MODIFY `idGroupQueue` INTEGER NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `queues` ADD CONSTRAINT `queues_idGroupQueue_fkey` FOREIGN KEY (`idGroupQueue`) REFERENCES `groupQueue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
