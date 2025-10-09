-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "curentStreak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuessedSong" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "album" TEXT,
    "cover" TEXT NOT NULL,
    "correctStatus" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GuessedSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySong" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "album" TEXT,
    "cover" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "startTime" INTEGER,
    "heardleDay" INTEGER,
    "nextReset" TIMESTAMP(3),

    CONSTRAINT "DailySong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "album" TEXT,
    "cover" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_userId_key" ON "Statistics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GuessedSong_userId_key" ON "GuessedSong"("userId");

-- AddForeignKey
ALTER TABLE "Statistics" ADD CONSTRAINT "Statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuessedSong" ADD CONSTRAINT "GuessedSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
