/*
  Warnings:

  - You are about to drop the `A5Documents` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[A5Documents];

-- CreateTable
CREATE TABLE [dbo].[ProcessMaster] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [DocumentType] VARCHAR(10) NOT NULL,
    [Description] NVARCHAR(255),
    [ProcessDefinitionId] VARCHAR(200),
    [ProcessDefinitionKey] VARCHAR(20),
    [Version] INT NOT NULL,
    [IsLatestVersion] BIT NOT NULL CONSTRAINT [ProcessMaster_IsLatestVersion_df] DEFAULT 1,
    CONSTRAINT [ProcessMaster_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[StepMaster] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [NameInFlowable] NVARCHAR(255),
    [Description] NVARCHAR(255),
    [FieldControl] TEXT,
    [Version] INT NOT NULL,
    [FunctionHandler] VARCHAR(100),
    [Status] BIT NOT NULL CONSTRAINT [StepMaster_Status_df] DEFAULT 1,
    CONSTRAINT [StepMaster_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[ProcessStep] (
    [ProcessMasterId] UNIQUEIDENTIFIER NOT NULL,
    [StepMasterId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [ProcessStep_pkey] PRIMARY KEY CLUSTERED ([ProcessMasterId],[StepMasterId])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentMaster] (
    [DocumentId] UNIQUEIDENTIFIER NOT NULL,
    [DocumentNo] VARCHAR(20) NOT NULL,
    [ProcessMasterId] UNIQUEIDENTIFIER,
    [DocumentType] VARCHAR(10),
    [ProcessInstanceId] VARCHAR(50),
    [IssueSection] CHAR(4),
    [IssueDate] DATETIME2,
    [ReceiveSection] CHAR(4),
    [FinishDate] DATETIME2,
    [CancelReason] NVARCHAR(255),
    [Status] CHAR(1),
    CONSTRAINT [DocumentMaster_pkey] PRIMARY KEY CLUSTERED ([DocumentId])
);

-- CreateTable
CREATE TABLE [dbo].[A5Document] (
    [DocumentId] UNIQUEIDENTIFIER NOT NULL,
    [DocumentNo] VARCHAR(20) NOT NULL,
    [IssueCategory] VARCHAR(30) NOT NULL,
    [ItemCategory] VARCHAR(30) NOT NULL,
    [LineNo] VARCHAR(10) NOT NULL,
    [JobOrderNo] VARCHAR(12),
    [MachineNo] VARCHAR(10) NOT NULL,
    [LotNo] VARCHAR(6) NOT NULL,
    [BatchNo] VARCHAR(10) NOT NULL,
    [ItemCode] VARCHAR(30) NOT NULL,
    [Rubber] VARCHAR(10) NOT NULL,
    [Glue] VARCHAR(10) NOT NULL,
    [DetectionStage] NVARCHAR(30) NOT NULL,
    [DetectionContent] VARCHAR(10) NOT NULL,
    [OtherError] NVARCHAR(100),
    [DetectedBy] VARCHAR(8) NOT NULL,
    [DetectedQuantity] INT NOT NULL,
    [AbnormalArea] VARCHAR(10) NOT NULL,
    [DetectedAt] DATETIME2 NOT NULL,
    [NormalDescription] NVARCHAR(250) NOT NULL,
    [AbnormalDescription] NVARCHAR(250) NOT NULL,
    [CheckedBy] VARCHAR(8),
    [AbnormalLevel] TINYINT,
    [FirstDetection] BIT,
    [RecurrenceCount] INT,
    [IsA4Required] BIT,
    [NGQtyAfterHandling] INT,
    [OKQtyAfterHandling] INT,
    [AMSDocumentNo] VARCHAR(30),
    CONSTRAINT [A5Document_pkey] PRIMARY KEY CLUSTERED ([DocumentId])
);

-- CreateTable
CREATE TABLE [dbo].[A5ToA4IssueData] (
    [DocumentId] UNIQUEIDENTIFIER NOT NULL,
    [OtherAbnormalContent] NVARCHAR(100),
    [BatchQty] INT,
    [LotQty] INT,
    [NeedCheckingQty] INT,
    [QtyChecked] INT,
    [ControlOfBeginning] BIT,
    [AttachSample] BIT,
    [NGEmp] VARCHAR(10),
    CONSTRAINT [A5ToA4IssueData_pkey] PRIMARY KEY CLUSTERED ([DocumentId])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProcessStep] ADD CONSTRAINT [ProcessStep_ProcessMasterId_fkey] FOREIGN KEY ([ProcessMasterId]) REFERENCES [dbo].[ProcessMaster]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProcessStep] ADD CONSTRAINT [ProcessStep_StepMasterId_fkey] FOREIGN KEY ([StepMasterId]) REFERENCES [dbo].[StepMaster]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentMaster] ADD CONSTRAINT [DocumentMaster_ProcessMasterId_fkey] FOREIGN KEY ([ProcessMasterId]) REFERENCES [dbo].[ProcessMaster]([Id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[A5Document] ADD CONSTRAINT [A5Document_DocumentId_fkey] FOREIGN KEY ([DocumentId]) REFERENCES [dbo].[DocumentMaster]([DocumentId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[A5ToA4IssueData] ADD CONSTRAINT [A5ToA4IssueData_DocumentId_fkey] FOREIGN KEY ([DocumentId]) REFERENCES [dbo].[A5Document]([DocumentId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
