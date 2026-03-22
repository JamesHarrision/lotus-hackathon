-- AlterTable
ALTER TABLE `routinghistory` ADD COLUMN `estimatedWaitTime` DOUBLE NULL;

-- CreateTable
CREATE TABLE `BranchLoadLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branchId` INTEGER NOT NULL,
    `currentLoad` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BranchLoadLog_branchId_timestamp_idx`(`branchId`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Incentive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enterpriseId` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `discountVal` DOUBLE NOT NULL,
    `isPercentage` BOOLEAN NOT NULL DEFAULT true,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Incentive_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BranchLoadLog` ADD CONSTRAINT `BranchLoadLog_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Incentive` ADD CONSTRAINT `Incentive_enterpriseId_fkey` FOREIGN KEY (`enterpriseId`) REFERENCES `Enterprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
