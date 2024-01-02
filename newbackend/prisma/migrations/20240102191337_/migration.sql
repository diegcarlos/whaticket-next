-- AddForeignKey
ALTER TABLE `userqueues` ADD CONSTRAINT `Queues_queueId_foreign_idx` FOREIGN KEY (`queueId`) REFERENCES `queues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
