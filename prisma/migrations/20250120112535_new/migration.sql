/*
  Warnings:

  - Made the column `ingredients` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instructions` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comment` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recipeId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "ingredients" SET NOT NULL,
ALTER COLUMN "instructions" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "comment" SET NOT NULL,
ALTER COLUMN "recipeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
