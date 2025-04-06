/*
  Warnings:

  - You are about to alter the column `tags` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "tags" VARCHAR(50)[];

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "tags" SET DATA TYPE VARCHAR(50)[];
