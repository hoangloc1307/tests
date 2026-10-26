export const FEATURES = {
  ISSUE_A5: 'ISSUE_A5',
  ROLE: 'ROLE',
  TASK: 'TASK',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
