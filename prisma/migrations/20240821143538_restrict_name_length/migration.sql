/*
  Warnings:

  - You are about to alter the column `name` on the `Score` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE "Score" ALTER COLUMN "name" SET DATA TYPE VARCHAR(15);
