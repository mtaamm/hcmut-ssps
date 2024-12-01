-- CreateTable
CREATE TABLE `printer_page_size` (
    `printer_id` CHAR(36) NOT NULL,
    `page_size` CHAR(2) NOT NULL,
    `current_page` INTEGER NOT NULL,

    PRIMARY KEY (`printer_id`, `page_size`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `print_job` (
    `id` CHAR(36) NOT NULL,
    `printer_id` CHAR(36) NOT NULL,
    `student_id` CHAR(36) NOT NULL,
    `filename` VARCHAR(100) NOT NULL,
    `time` DATETIME(0) NOT NULL,
    `page` INTEGER NOT NULL,
    `copy` INTEGER NOT NULL,
    `page_size` CHAR(2) NOT NULL,
    `two_side` BIT(1) NOT NULL,
    `color` BIT(1) NOT NULL,
    `status` VARCHAR(8) NOT NULL,

    INDEX `fk_print_job_user_printer_idx`(`student_id`, `printer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `printer` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `machine_type` VARCHAR(45) NOT NULL,
    `time` DATETIME(0) NOT NULL,
    `two_side` BIT(1) NOT NULL,
    `color` BIT(1) NOT NULL,
    `floor` INTEGER NOT NULL,
    `building` CHAR(2) NOT NULL,
    `status` VARCHAR(7) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `uid` CHAR(36) NOT NULL,
    `username` VARCHAR(45) NOT NULL,
    `password` VARCHAR(45) NOT NULL,
    `role` VARCHAR(7) NOT NULL,
    `mssv` INTEGER NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_page_size` (
    `student_id` CHAR(36) NOT NULL,
    `page_size` CHAR(2) NOT NULL,
    `current_page` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`student_id`, `page_size`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `printer_page_size` ADD CONSTRAINT `fk_page_size_printer1` FOREIGN KEY (`printer_id`) REFERENCES `printer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `print_job` ADD CONSTRAINT `fk_print_job_printer` FOREIGN KEY (`printer_id`) REFERENCES `printer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `print_job` ADD CONSTRAINT `fk_print_job_user1` FOREIGN KEY (`student_id`) REFERENCES `user`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_page_size` ADD CONSTRAINT `fk_student_page_size_user` FOREIGN KEY (`student_id`) REFERENCES `user`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
