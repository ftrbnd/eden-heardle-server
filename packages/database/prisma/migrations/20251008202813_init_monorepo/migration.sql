-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "firstStreak" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UnlimitedHeardle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "album" TEXT,
    "cover" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "startTime" INTEGER NOT NULL,
    "duration" INTEGER,

    CONSTRAINT "UnlimitedHeardle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FirstCompletedDaily" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "FirstCompletedDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FirstCompletedDaily_userId_key" ON "FirstCompletedDaily"("userId");

-- AddForeignKey
ALTER TABLE "FirstCompletedDaily" ADD CONSTRAINT "FirstCompletedDaily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
