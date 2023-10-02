/*
  Warnings:

  - You are about to drop the column `userId` on the `GuessedSong` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[guessListId]` on the table `GuessedSong` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guessListId` to the `GuessedSong` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GuessedSong" DROP CONSTRAINT "GuessedSong_userId_fkey";

-- DropIndex
DROP INDEX "GuessedSong_userId_key";

-- AlterTable
ALTER TABLE "GuessedSong" DROP COLUMN "userId",
ADD COLUMN     "guessListId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Guesses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Guesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guesses_userId_key" ON "Guesses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GuessedSong_guessListId_key" ON "GuessedSong"("guessListId");

-- AddForeignKey
ALTER TABLE "Guesses" ADD CONSTRAINT "Guesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuessedSong" ADD CONSTRAINT "GuessedSong_guessListId_fkey" FOREIGN KEY ("guessListId") REFERENCES "Guesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
