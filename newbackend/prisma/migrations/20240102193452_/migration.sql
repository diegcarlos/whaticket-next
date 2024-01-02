-- AlterTable
ALTER TABLE `whatsappqueues` ADD COLUMN `queuesId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `whatsappqueues` ADD CONSTRAINT `whatsappqueues_queuesId_fkey` FOREIGN KEY (`queuesId`) REFERENCES `queues`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whatsappqueues` ADD CONSTRAINT `whatsappqueues_whatsappId_fkey` FOREIGN KEY (`whatsappId`) REFERENCES `whatsapps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
