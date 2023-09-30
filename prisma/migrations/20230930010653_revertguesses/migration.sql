/*
  Warnings:

  - You are about to drop the column `listId` on the `GuessedSong` table. All the data in the column will be lost.
  - You are about to drop the `Guesses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `GuessedSong` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `GuessedSong` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GuessedSong" DROP CONSTRAINT "GuessedSong_listId_fkey";

-- DropForeignKey
ALTER TABLE "Guesses" DROP CONSTRAINT "Guesses_userId_fkey";

-- DropIndex
DROP INDEX "GuessedSong_listId_key";

-- AlterTable
ALTER TABLE "GuessedSong" DROP COLUMN "listId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Guesses";

-- CreateIndex
CREATE UNIQUE INDEX "GuessedSong_userId_key" ON "GuessedSong"("userId");

-- AddForeignKey
ALTER TABLE "GuessedSong" ADD CONSTRAINT "GuessedSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
