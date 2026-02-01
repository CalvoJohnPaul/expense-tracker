/*
  Warnings:

  - The values [UPDATE_ADMIN_PASSWORD,UPDATE_MEMBER_PASSWORD] on the enum `AdminActivityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminActivityType_new" AS ENUM ('LOG_IN', 'CREATE_ADMIN_ACCOUNT', 'UPDATE_ADMIN_ACCOUNT', 'DELETE_ADMIN_ACCOUNT', 'SUSPEND_ADMIN_ACCOUNT', 'UNSUSPEND_ADMIN_ACCOUNT', 'CREATE_MEMBER_ACCOUNT', 'UPDATE_MEMBER_ACCOUNT', 'DELETE_MEMBER_ACCOUNT', 'SUSPEND_MEMBER_ACCOUNT', 'UNSUSPEND_MEMBER_ACCOUNT');
ALTER TABLE "AdminActivity" ALTER COLUMN "type" TYPE "AdminActivityType_new" USING ("type"::text::"AdminActivityType_new");
ALTER TYPE "AdminActivityType" RENAME TO "AdminActivityType_old";
ALTER TYPE "AdminActivityType_new" RENAME TO "AdminActivityType";
DROP TYPE "public"."AdminActivityType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'SUSPEND_ADMIN_ACCOUNT';
ALTER TYPE "Permission" ADD VALUE 'UNSUSPEND_ADMIN_ACCOUNT';
ALTER TYPE "Permission" ADD VALUE 'SUSPEND_MEMBER_ACCOUNT';
ALTER TYPE "Permission" ADD VALUE 'UNSUSPEND_MEMBER_ACCOUNT';
