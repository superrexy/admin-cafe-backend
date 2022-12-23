/*
  Warnings:

  - You are about to alter the column `tgl_pemesanan` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expired_at` on the `user_reset_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `amount` to the `booking_food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `foods_drinks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking_food` ADD COLUMN `amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `bookings` MODIFY `tgl_pemesanan` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `foods_drinks` ADD COLUMN `image` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `image` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user_reset_password` MODIFY `expired_at` DATETIME NOT NULL;
