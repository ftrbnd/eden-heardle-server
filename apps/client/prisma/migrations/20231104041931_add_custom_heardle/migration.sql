-- CreateTable
CREATE TABLE "CustomHeardle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "album" TEXT,
    "cover" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "startTime" INTEGER NOT NULL,
    "duration" INTEGER,

    CONSTRAINT "CustomHeardle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomHeardle_userId_key" ON "CustomHeardle"("userId");

-- AddForeignKey
ALTER TABLE "CustomHeardle" ADD CONSTRAINT "CustomHeardle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
