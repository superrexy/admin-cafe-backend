-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(16) NULL,
    `address` VARCHAR(255) NULL,
    `image_profile` VARCHAR(255) NULL,
    `birth_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `fasilitas` VARCHAR(255) NOT NULL,
    `kapasitas` VARCHAR(255) NOT NULL,
    `waktu` VARCHAR(255) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foods_drinks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `deskripsi` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pemesan` VARCHAR(255) NOT NULL,
    `email_pemesan` VARCHAR(255) NOT NULL,
    `tgl_pemesanan` DATETIME NOT NULL,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `is_paid` BOOLEAN NOT NULL DEFAULT false,
    `room_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_food` (
    `booking_id` INTEGER NOT NULL,
    `food_drink_id` INTEGER NOT NULL,

    PRIMARY KEY (`booking_id`, `food_drink_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_food` ADD CONSTRAINT `booking_food_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_food` ADD CONSTRAINT `booking_food_food_drink_id_fkey` FOREIGN KEY (`food_drink_id`) REFERENCES `foods_drinks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
