/*
  Warnings:

  - You are about to drop the column `DocumentNo` on the `A5Document` table. All the data in the column will be lost.
  - Added the required column `DetectedAt` to the `A5Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IsHandlingRequired` to the `A5Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Judgment` to the `A5Document` table without a default value. This is not possible if the table is not empty.
  - Made the column `AbnormalLevel` on table `A5Document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `FirstDetection` on table `A5Document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IsA4Required` on table `A5Document` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[A5Document] ALTER COLUMN [AbnormalLevel] TINYINT NOT NULL;
ALTER TABLE [dbo].[A5Document] ALTER COLUMN [FirstDetection] BIT NOT NULL;
ALTER TABLE [dbo].[A5Document] ALTER COLUMN [IsA4Required] BIT NOT NULL;
ALTER TABLE [dbo].[A5Document] DROP COLUMN [DocumentNo];
ALTER TABLE [dbo].[A5Document] ADD [DetectedAt] DATETIME2 NOT NULL,
[HandlingInstruction] NVARCHAR(500),
[HandlingScope] NVARCHAR(255),
[IsHandlingRequired] BIT NOT NULL,
[Judgment] BIT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
