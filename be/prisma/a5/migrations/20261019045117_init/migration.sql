BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[A5Documents] (
    [DocumentId] UNIQUEIDENTIFIER NOT NULL,
    [IssueCode] VARCHAR(20) NOT NULL,
    [Category] VARCHAR(30) NOT NULL,
    [DetectionType] VARCHAR(30) NOT NULL,
    [Line] VARCHAR(10) NOT NULL,
    [JobNo] VARCHAR(12),
    [Machine] VARCHAR(10) NOT NULL,
    [LotNo] VARCHAR(6) NOT NULL,
    [Batch] VARCHAR(10) NOT NULL,
    [ProductCode] VARCHAR(30) NOT NULL,
    [Rubber] VARCHAR(10) NOT NULL,
    [Glue] VARCHAR(10) NOT NULL,
    [DetectionProcess] NVARCHAR(30) NOT NULL,
    [ErrorCode] VARCHAR(10) NOT NULL,
    [OtherError] NVARCHAR(100),
    [Recorder] VARCHAR(8) NOT NULL,
    [Quantity] INT NOT NULL,
    [AnomalyLocation] VARCHAR(10) NOT NULL,
    [DetectedAt] DATETIME2 NOT NULL,
    [NormalCondition] NVARCHAR(250) NOT NULL,
    [AbnormalCondition] NVARCHAR(250) NOT NULL,
    [CheckedBy] VARCHAR(8) NOT NULL,
    [AbnormalLevel] TINYINT,
    [FirstDetection] BIT,
    [RecurrenceCount] INT,
    [IsA4Required] BIT,
    [NGQtyAfterHandling] INT,
    [OKQtyAfterHandling] INT,
    [AMSDocumentNo] VARCHAR(30),
    CONSTRAINT [PK_A5Documents] PRIMARY KEY CLUSTERED ([DocumentId])
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
