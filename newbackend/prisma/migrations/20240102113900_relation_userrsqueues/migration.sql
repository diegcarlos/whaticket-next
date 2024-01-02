-- AddForeignKey
ALTER TABLE `userqueues` ADD CONSTRAINT `userqueues_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userqueues` ADD CONSTRAINT `userqueues_queueId_fkey` FOREIGN KEY (`queueId`) REFERENCES `queues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
