/*
  Warnings:

  - Made the column `ProcessMasterId` on table `DocumentMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DocumentType` on table `DocumentMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ProcessInstanceId` on table `DocumentMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IssueSection` on table `DocumentMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IssueDate` on table `DocumentMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Status` on table `DocumentMaster` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[DocumentMaster] DROP CONSTRAINT [DocumentMaster_ProcessMasterId_fkey];

-- AlterTable
ALTER TABLE [dbo].[DocumentMaster] ALTER COLUMN [ProcessMasterId] UNIQUEIDENTIFIER NOT NULL;
ALTER TABLE [dbo].[DocumentMaster] ALTER COLUMN [DocumentType] VARCHAR(10) NOT NULL;
ALTER TABLE [dbo].[DocumentMaster] ALTER COLUMN [ProcessInstanceId] VARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[DocumentMaster] ALTER COLUMN [IssueSection] CHAR(4) NOT NULL;
ALTER TABLE [dbo].[DocumentMaster] ALTER COLUMN [IssueDate] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[DocumentMaster] ALTER COLUMN [Status] CHAR(1) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentMaster] ADD CONSTRAINT [DocumentMaster_ProcessMasterId_fkey] FOREIGN KEY ([ProcessMasterId]) REFERENCES [dbo].[ProcessMaster]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
