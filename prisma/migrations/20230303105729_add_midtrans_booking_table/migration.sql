/*
  Warnings:

  - You are about to alter the column `tgl_pemesanan` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `is_paid` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(0))`.
  - You are about to alter the column `expired_at` on the `user_reset_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `is_finished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `payment_type` VARCHAR(255) NULL,
    ADD COLUMN `transaction_id` VARCHAR(255) NULL,
    MODIFY `tgl_pemesanan` DATETIME NOT NULL,
    MODIFY `is_paid` ENUM('SETTLEMENT', 'PENDING', 'EXPIRE', 'CANCEL', 'DENY') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user_reset_password` MODIFY `expired_at` DATETIME NOT NULL;
