/*
  Warnings:

  - The primary key for the `Lecture` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Lecture` table. All the data in the column will be lost.
  - The primary key for the `Position` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `link` on the `Position` table. All the data in the column will be lost.
  - Added the required column `id` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_link_fkey";

-- AlterTable
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_pkey",
DROP COLUMN "image",
DROP COLUMN "link",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Position" DROP CONSTRAINT "Position_pkey",
DROP COLUMN "link",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Position_pkey" PRIMARY KEY ("id", "fen");

-- CreateIndex
CREATE INDEX "Lecture_publishedAt_idx" ON "Lecture"("publishedAt" DESC);

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_id_fkey" FOREIGN KEY ("id") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
