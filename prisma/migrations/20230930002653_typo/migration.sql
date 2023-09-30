/*
  Warnings:

  - You are about to drop the column `curentStreak` on the `Statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Statistics" DROP COLUMN "curentStreak",
ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0;
