export const FLOWABLE_APPROVAL = {
  APPROVED: 'APPROVED', // Duyệt
  RETURNED: 'RETURNED', // Trả về
  REJECTED: 'REJECTED', // Từ chối
  CANCELLED: 'CANCELLED', // Huỷ
} as const;

export type FlowableApprovalValue = (typeof FLOWABLE_APPROVAL)[keyof typeof FLOWABLE_APPROVAL];

export const FLOWABLE_VARIABLE_SCOPE = {
  GLOBAL: 'global',
  LOCAL: 'local',
} as const;

export type FlowableVariableScopeValue =
  (typeof FLOWABLE_VARIABLE_SCOPE)[keyof typeof FLOWABLE_VARIABLE_SCOPE];

export const FLOWABLE_VARIABLE_NAME = {
  ISSUER: 'issuer',
  DOCUMENT_NO: 'document_no',
  DOCUMENT_TYPE: 'document_type',
  APPROVAL: 'approval',
  COMPLETED_BY: 'completed_by',
  COMMENT: 'comment',
  SECTION_CREATED: 'section_created',
} as const;

export type FlowableVariableNameValue =
  (typeof FLOWABLE_VARIABLE_NAME)[keyof typeof FLOWABLE_VARIABLE_NAME];
