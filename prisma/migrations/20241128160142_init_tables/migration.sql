-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `sesameId` VARCHAR(191) NULL,
    `sesame_linked_at` DATETIME(3) NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `admin_username_key`(`username`),
    UNIQUE INDEX `admin_sesameId_key`(`sesameId`),
    INDEX `admin_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `sesameId` VARCHAR(191) NULL,
    `sesame_linked_at` DATETIME(3) NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `account_validated_by` VARCHAR(191) NULL,
    `account_validated_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `player_username_key`(`username`),
    UNIQUE INDEX `player_sesameId_key`(`sesameId`),
    INDEX `player_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `player` ADD CONSTRAINT `admin_validator` FOREIGN KEY (`account_validated_by`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
