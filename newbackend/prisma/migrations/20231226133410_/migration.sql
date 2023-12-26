-- AlterTable
ALTER TABLE `queues` ADD COLUMN `whatsappsId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `queues` ADD CONSTRAINT `queues_whatsappsId_fkey` FOREIGN KEY (`whatsappsId`) REFERENCES `whatsapps`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
