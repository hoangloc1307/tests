/*
  Warnings:

  - You are about to drop the `ProcessStep` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `DocumentType` to the `StepMaster` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ProcessStep] DROP CONSTRAINT [ProcessStep_ProcessMasterId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProcessStep] DROP CONSTRAINT [ProcessStep_StepMasterId_fkey];

-- AlterTable
ALTER TABLE [dbo].[StepMaster] ADD [DocumentType] VARCHAR(10) NOT NULL;

-- DropTable
DROP TABLE [dbo].[ProcessStep];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
