/*
  Warnings:

  - The values [EXPORT_ADMIN_ACCOUNT,EXPORT_MEMBER_ACCOUNT,EXPORT_ADMIN_ACTIVITY] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('CREATE_ADMIN_ACCOUNT', 'UPDATE_ADMIN_ACCOUNT', 'UPDATE_ADMIN_PASSWORD', 'DELETE_ADMIN_ACCOUNT', 'CREATE_MEMBER_ACCOUNT', 'UPDATE_MEMBER_ACCOUNT', 'UPDATE_MEMBER_PASSWORD', 'DELETE_MEMBER_ACCOUNT');
ALTER TABLE "public"."Account" ALTER COLUMN "permissions" DROP DEFAULT;
ALTER TABLE "Account" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "public"."Permission_old";
ALTER TABLE "Account" ALTER COLUMN "permissions" SET DEFAULT ARRAY[]::"Permission"[];
COMMIT;
