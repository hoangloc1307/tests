BEGIN TRY

BEGIN TRAN;

-- DropPrimaryKey (composite key cũ trên Username, RoleId, SectionId)
ALTER TABLE [dbo].[UserRole] DROP CONSTRAINT [UserRole_pkey];

-- AddColumn Id (surrogate key)
ALTER TABLE [dbo].[UserRole] ADD [Id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [UserRole_id_df] DEFAULT newid();

-- AddPrimaryKey trên Id
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_pkey] PRIMARY KEY CLUSTERED ([Id]);

-- CreateIndex unique cho (Username, RoleId, SectionId)
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_username_roleId_sectionId_key] UNIQUE NONCLUSTERED ([Username], [RoleId], [SectionId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
