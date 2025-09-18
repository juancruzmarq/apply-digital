/*
  Warnings:

  - You are about to drop the column `name` on the `Currency` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `Currency` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Currency" DROP COLUMN "name",
DROP COLUMN "symbol";
