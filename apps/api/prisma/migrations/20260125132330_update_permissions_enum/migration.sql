/*
  Warnings:

  - The values [WRITE_ADMIN_ACCOUNT,WRITE_MEMBER_ACCOUNT] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('READ_ADMIN_ACCOUNT', 'CREATE_ADMIN_ACCOUNT', 'UPDATE_ADMIN_ACCOUNT', 'DELETE_ADMIN_ACCOUNT', 'EXPORT_ADMIN_ACCOUNT', 'READ_MEMBER_ACCOUNT', 'CREATE_MEMBER_ACCOUNT', 'UPDATE_MEMBER_ACCOUNT', 'DELETE_MEMBER_ACCOUNT', 'EXPORT_MEMBER_ACCOUNT', 'READ_ADMIN_ACTIVITY', 'EXPORT_ADMIN_ACTIVITY');
ALTER TABLE "public"."Account" ALTER COLUMN "permissions" DROP DEFAULT;
ALTER TABLE "Account" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "public"."Permission_old";
ALTER TABLE "Account" ALTER COLUMN "permissions" SET DEFAULT ARRAY[]::"Permission"[];
COMMIT;
