export const FEATURES = {
  ISSUE: 'ISSUE',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
