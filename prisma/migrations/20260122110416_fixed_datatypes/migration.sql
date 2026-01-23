/*
  Warnings:

  - The `foundInHashtags` column on the `Reel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hashtags` column on the `Reel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `postedAt` column on the `Reel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `generatedAt` column on the `ResearchSummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hashtagsPrimary` column on the `ScriptIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hashtagsNiche` column on the `ScriptIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hashtagsTrending` column on the `ScriptIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hashtagsAll` column on the `ScriptIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `generatedAt` column on the `ScriptIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `postedAt` column on the `Tweet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `postDate` column on the `Tweet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reel" DROP COLUMN "foundInHashtags",
ADD COLUMN     "foundInHashtags" TEXT[],
DROP COLUMN "hashtags",
ADD COLUMN     "hashtags" TEXT[],
DROP COLUMN "postedAt",
ADD COLUMN     "postedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ResearchSummary" DROP COLUMN "generatedAt",
ADD COLUMN     "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ScriptIdea" DROP COLUMN "hashtagsPrimary",
ADD COLUMN     "hashtagsPrimary" TEXT[],
DROP COLUMN "hashtagsNiche",
ADD COLUMN     "hashtagsNiche" TEXT[],
DROP COLUMN "hashtagsTrending",
ADD COLUMN     "hashtagsTrending" TEXT[],
DROP COLUMN "hashtagsAll",
ADD COLUMN     "hashtagsAll" TEXT[],
DROP COLUMN "generatedAt",
ADD COLUMN     "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "postedAt",
ADD COLUMN     "postedAt" TIMESTAMP(3),
DROP COLUMN "postDate",
ADD COLUMN     "postDate" TIMESTAMP(3);
