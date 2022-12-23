/*
  Warnings:

  - You are about to alter the column `tgl_pemesanan` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `expired_at` to the `user_reset_password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` MODIFY `tgl_pemesanan` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user_reset_password` ADD COLUMN `expired_at` DATETIME NOT NULL;
