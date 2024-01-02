-- AddForeignKey
ALTER TABLE `userqueues` ADD CONSTRAINT `Users_userId_foreign_idx` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
