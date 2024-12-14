-- CreateTable
CREATE TABLE "Lecture" (
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("link")
);

-- CreateTable
CREATE TABLE "Position" (
    "link" TEXT NOT NULL,
    "fen" TEXT NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("link","fen")
);

-- CreateIndex
CREATE INDEX "Position_fen_idx" ON "Position"("fen");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_link_fkey" FOREIGN KEY ("link") REFERENCES "Lecture"("link") ON DELETE CASCADE ON UPDATE CASCADE;
