/*
  Warnings:

  - The column `NameInFlowable` on the `StepMaster` table is renamed to `StepKey`. Existing data is preserved.

*/
BEGIN TRY

BEGIN TRAN;

-- RenameColumn
EXEC sp_rename '[dbo].[StepMaster].[NameInFlowable]', 'StepKey', 'COLUMN';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
