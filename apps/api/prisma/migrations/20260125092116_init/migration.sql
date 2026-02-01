-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('READ_ADMIN_ACCOUNT', 'WRITE_ADMIN_ACCOUNT', 'READ_MEMBER_ACCOUNT', 'WRITE_MEMBER_ACCOUNT', 'READ_ADMIN_ACTIVITY');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('HOUSING', 'UTILITIES', 'TRANSPORTATION', 'FOOD', 'INSURANCE', 'HEALTHCARE', 'DEBT_PAYMENT', 'PERSONAL_CARE', 'ENTERTAINMENT', 'SAVINGS', 'EDUCATION', 'CLOTHING', 'MISCELLANEOUS', 'OTHERS');

-- CreateEnum
CREATE TYPE "AdminActivityType" AS ENUM ('LOG_IN', 'CREATE_ADMIN_ACCOUNT', 'UPDATE_ADMIN_ACCOUNT', 'DELETE_ADMIN_ACCOUNT', 'SUSPEND_ADMIN_ACCOUNT', 'UNSUSPEND_ADMIN_ACCOUNT', 'CREATE_MEMBER_ACCOUNT', 'UPDATE_MEMBER_ACCOUNT', 'DELETE_MEMBER_ACCOUNT', 'SUSPEND_MEMBER_ACCOUNT', 'UNSUSPEND_MEMBER_ACCOUNT');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'MEMBER',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "password" TEXT NOT NULL,
    "permissions" "Permission"[] DEFAULT ARRAY[]::"Permission"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "category" "ExpenseCategory" NOT NULL DEFAULT 'OTHERS',
    "description" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminActivity" (
    "id" SERIAL NOT NULL,
    "type" "AdminActivityType" NOT NULL,
    "accountId" INTEGER NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFile_url_key" ON "UploadedFile"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_code_key" ON "Otp"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminActivity" ADD CONSTRAINT "AdminActivity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
