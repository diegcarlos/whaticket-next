-- AlterTable
ALTER TABLE `groupqueue` ADD COLUMN `queuesId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `groupQueue` ADD CONSTRAINT `groupQueue_queuesId_fkey` FOREIGN KEY (`queuesId`) REFERENCES `queues`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
