/*
  Warnings:

  - You are about to drop the column `apiId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_recipeId_fkey";

-- DropIndex
DROP INDEX "Recipe_apiId_key";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "apiId",
DROP COLUMN "description",
DROP COLUMN "image",
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL,
ALTER COLUMN "recipeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
