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
