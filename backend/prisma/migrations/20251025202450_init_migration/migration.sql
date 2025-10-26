/*
  Warnings:

  - The values [FREELANCER,CLIENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `freelancerId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `skillsRequired` on the `Project` table. All the data in the column will be lost.
  - The `id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Interview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recording` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Interview" DROP CONSTRAINT "Interview_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Interview" DROP CONSTRAINT "Interview_interviewerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Interview" DROP CONSTRAINT "Interview_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_freelancerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Recording" DROP CONSTRAINT "Recording_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Recording" DROP CONSTRAINT "Recording_userId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "clientId",
DROP COLUMN "freelancerId",
DROP COLUMN "skillsRequired",
ADD COLUMN     "ownerId" INTEGER,
ADD COLUMN     "skills" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "budget" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OPEN',
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Interview";

-- DropTable
DROP TABLE "public"."Recording";

-- DropEnum
DROP TYPE "public"."InterviewStatus";

-- DropEnum
DROP TYPE "public"."ProjectStatus";

-- DropEnum
DROP TYPE "public"."ResultStatus";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
