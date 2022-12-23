/*
  Warnings:

  - You are about to alter the column `tgl_pemesanan` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expired_at` on the `user_reset_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `booking_food` ADD COLUMN `note` TEXT NULL;

-- AlterTable
ALTER TABLE `bookings` MODIFY `tgl_pemesanan` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user_reset_password` MODIFY `expired_at` DATETIME NOT NULL;
