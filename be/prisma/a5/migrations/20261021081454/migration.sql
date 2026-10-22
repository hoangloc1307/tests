/*
  Warnings:

  - You are about to drop the column `Status` on the `StepMaster` table. All the data in the column will be lost.
  - You are about to drop the `A5ToA4IssueData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `CreatedBy` to the `DocumentMaster` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[A5ToA4IssueData] DROP CONSTRAINT [A5ToA4IssueData_DocumentId_fkey];

-- AlterTable
ALTER TABLE [dbo].[A5Document] ADD [AttachSample] BIT,
[BatchQty] INT,
[ControlOfBeginning] BIT,
[LotQty] INT,
[NGEmp] VARCHAR(10),
[NeedCheckingQty] INT,
[OtherAbnormalContent] NVARCHAR(100),
[QtyChecked] INT;

-- AlterTable
ALTER TABLE [dbo].[DocumentMaster] ADD [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DocumentMaster_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
[CreatedBy] CHAR(8) NOT NULL,
[IsActive] BIT NOT NULL CONSTRAINT [DocumentMaster_IsActive_df] DEFAULT 1,
[UpdatedAt] DATETIME2,
[UpdatedBy] CHAR(8);

-- AlterTable
ALTER TABLE [dbo].[ProcessMaster] ADD [IsActive] BIT NOT NULL CONSTRAINT [ProcessMaster_IsActive_df] DEFAULT 1;

-- AlterTable
-- Drop the default constraint bound to [Status] before dropping the column
-- (SQL Server forbids dropping a column while a constraint depends on it).
DECLARE @StepMaster_Status_df NVARCHAR(128);
SELECT @StepMaster_Status_df = [df].[name]
FROM [sys].[default_constraints] [df]
INNER JOIN [sys].[columns] [c]
    ON [c].[object_id] = [df].[parent_object_id]
    AND [c].[column_id] = [df].[parent_column_id]
WHERE [df].[parent_object_id] = OBJECT_ID(N'[dbo].[StepMaster]')
    AND [c].[name] = N'Status';
IF @StepMaster_Status_df IS NOT NULL
    EXEC(N'ALTER TABLE [dbo].[StepMaster] DROP CONSTRAINT [' + @StepMaster_Status_df + N']');
ALTER TABLE [dbo].[StepMaster] DROP COLUMN [Status];
ALTER TABLE [dbo].[StepMaster] ADD [IsActive] BIT NOT NULL CONSTRAINT [StepMaster_IsActive_df] DEFAULT 1;

-- DropTable
DROP TABLE [dbo].[A5ToA4IssueData];

-- CreateTable
CREATE TABLE [dbo].[DocumentSequence] (
    [Code] VARCHAR(50) NOT NULL,
    [Name] VARCHAR(150) NOT NULL,
    [Prefix] VARCHAR(20) NOT NULL,
    [Suffix] VARCHAR(20) NOT NULL,
    [Format] VARCHAR(20) NOT NULL,
    [StartSerialNo] VARCHAR(10) NOT NULL,
    [ResetCycle] VARCHAR(10) NOT NULL CONSTRAINT [DocumentSequence_ResetCycle_df] DEFAULT 'DAILY',
    [Step] INT NOT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [DocumentSequence_IsActive_df] DEFAULT 1,
    [CreatedBy] CHAR(8) NOT NULL,
    [createdAt] DATETIME2 NOT NULL,
    [UpdatedBy] CHAR(8),
    [UpdatedAt] DATETIME2,
    CONSTRAINT [DocumentSequence_pkey] PRIMARY KEY CLUSTERED ([Code])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentSequenceCounter] (
    [SequenceCode] VARCHAR(50) NOT NULL,
    [PeriodKey] VARCHAR(10) NOT NULL,
    [LastNumber] INT NOT NULL CONSTRAINT [DocumentSequenceCounter_LastNumber_df] DEFAULT 0,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DocumentSequenceCounter_SequenceCode_PeriodKey_key] UNIQUE NONCLUSTERED ([SequenceCode],[PeriodKey])
);

-- AddForeignKey
ALTER TABLE [dbo].[DocumentSequenceCounter] ADD CONSTRAINT [DocumentSequenceCounter_SequenceCode_fkey] FOREIGN KEY ([SequenceCode]) REFERENCES [dbo].[DocumentSequence]([Code]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
