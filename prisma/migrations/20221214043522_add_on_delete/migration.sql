/*
  Warnings:

  - You are about to alter the column `tgl_pemesanan` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expired_at` on the `user_reset_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `booking_food` DROP FOREIGN KEY `booking_food_booking_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking_food` DROP FOREIGN KEY `booking_food_food_drink_id_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_room_id_fkey`;

-- AlterTable
ALTER TABLE `bookings` MODIFY `tgl_pemesanan` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user_reset_password` MODIFY `expired_at` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_food` ADD CONSTRAINT `booking_food_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_food` ADD CONSTRAINT `booking_food_food_drink_id_fkey` FOREIGN KEY (`food_drink_id`) REFERENCES `foods_drinks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
