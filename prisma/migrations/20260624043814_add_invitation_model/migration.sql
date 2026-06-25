/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invitedById` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Invitation` DROP FOREIGN KEY `Invitation_workspaceId_fkey`;

-- DropIndex
DROP INDEX `Invitation_email_workspaceId_key` ON `Invitation`;

-- DropIndex
DROP INDEX `Invitation_workspaceId_fkey` ON `Invitation`;

-- AlterTable
ALTER TABLE `Invitation` ADD COLUMN `invitedById` INTEGER NOT NULL,
    ADD COLUMN `token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invitation_token_key` ON `Invitation`(`token`);

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_invitedById_fkey` FOREIGN KEY (`invitedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
