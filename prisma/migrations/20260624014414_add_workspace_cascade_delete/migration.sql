-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_workspaceId_fkey`;

-- DropIndex
DROP INDEX `User_workspaceId_fkey` ON `User`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
