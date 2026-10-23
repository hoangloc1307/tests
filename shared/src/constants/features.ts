export const FEATURES = {
  ISSUE: 'ISSUE',
  ROLE: 'ROLE',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
