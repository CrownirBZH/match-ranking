-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `admin_username_key`(`username`),
    INDEX `admin_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `player_username_key`(`username`),
    INDEX `player_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `group_name_key`(`name`),
    INDEX `group_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_player` (
    `group_id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `group_player_active_idx`(`active`),
    PRIMARY KEY (`group_id`, `player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NOT NULL,
    `start_at` DATETIME(3) NOT NULL,
    `end_at` DATETIME(3) NOT NULL,
    `count_in_group_scoreboard` BOOLEAN NOT NULL,
    `detailed_set_mandatory` BOOLEAN NOT NULL,
    `players_can_create_matches` BOOLEAN NOT NULL,
    `players_can_validate_matches` BOOLEAN NOT NULL,
    `match_autovalidation` BOOLEAN NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `event_name_key`(`name`),
    INDEX `event_type_start_at_end_at_deleted_at_idx`(`type`, `start_at`, `end_at`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_referee` (
    `event_id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `event_referee_active_idx`(`active`),
    PRIMARY KEY (`event_id`, `player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `score_a` INTEGER NOT NULL DEFAULT 0,
    `score_b` INTEGER NOT NULL DEFAULT 0,
    `team_a_id` INTEGER NOT NULL,
    `team_b_id` INTEGER NOT NULL,
    `validated_at` DATETIME(3) NULL,
    `validated_by_admin_id` VARCHAR(191) NULL,
    `validated_by_player_id` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `match_team_a_id_key`(`team_a_id`),
    UNIQUE INDEX `match_team_b_id_key`(`team_b_id`),
    INDEX `match_status_validated_at_deleted_at_idx`(`status`, `validated_at`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_team_player` (
    `match_team_id` INTEGER NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`match_team_id`, `player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `set` (
    `set_type` VARCHAR(191) NOT NULL,
    `match_id` VARCHAR(191) NOT NULL,
    `set_number` INTEGER NOT NULL,
    `server_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`match_id`, `set_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `set_point` (
    `match_id` VARCHAR(191) NOT NULL,
    `set_number` INTEGER NOT NULL,
    `point_number` INTEGER NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `team_id` INTEGER NOT NULL,

    PRIMARY KEY (`match_id`, `set_number`, `point_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `group_player` ADD CONSTRAINT `group_player_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_player` ADD CONSTRAINT `group_player_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_referee` ADD CONSTRAINT `event_referee_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_referee` ADD CONSTRAINT `event_referee_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_team_a_id_fkey` FOREIGN KEY (`team_a_id`) REFERENCES `match_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_team_b_id_fkey` FOREIGN KEY (`team_b_id`) REFERENCES `match_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_validated_by_admin_id_fkey` FOREIGN KEY (`validated_by_admin_id`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_validated_by_player_id_fkey` FOREIGN KEY (`validated_by_player_id`) REFERENCES `player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_team` ADD CONSTRAINT `match_team_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_team_player` ADD CONSTRAINT `match_team_player_match_team_id_fkey` FOREIGN KEY (`match_team_id`) REFERENCES `match_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_team_player` ADD CONSTRAINT `match_team_player_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `set` ADD CONSTRAINT `set_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `set` ADD CONSTRAINT `set_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `set` ADD CONSTRAINT `set_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `set_point` ADD CONSTRAINT `set_point_match_id_set_number_fkey` FOREIGN KEY (`match_id`, `set_number`) REFERENCES `set`(`match_id`, `set_number`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `set_point` ADD CONSTRAINT `set_point_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `set_point` ADD CONSTRAINT `set_point_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `match_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
