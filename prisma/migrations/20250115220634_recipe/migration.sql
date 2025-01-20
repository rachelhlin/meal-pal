/*
  Warnings:

  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clubId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Review` table. All the data in the column will be lost.
  - The `id` column on the `Review` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Club` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comment` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_clubId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "clubId",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "recipeId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Club";

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "apiId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_apiId_key" ON "Recipe"("apiId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
