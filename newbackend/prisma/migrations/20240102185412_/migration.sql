-- DropForeignKey
ALTER TABLE `queues` DROP FOREIGN KEY `queues_usersId_fkey`;

-- DropForeignKey
ALTER TABLE `userqueues` DROP FOREIGN KEY `userqueues_userId_fkey`;
