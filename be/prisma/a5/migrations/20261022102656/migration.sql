BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserRole] (
    [Username] CHAR(8) NOT NULL,
    [RoleId] UNIQUEIDENTIFIER NOT NULL,
    [SectionId] CHAR(4) NOT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [UserRole_IsActive_df] DEFAULT 1,
    [CreatedBy] CHAR(8) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [UserRole_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] CHAR(8),
    [UpdatedAt] DATETIME2,
    CONSTRAINT [UserRole_pkey] PRIMARY KEY CLUSTERED ([Username],[RoleId],[SectionId])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
