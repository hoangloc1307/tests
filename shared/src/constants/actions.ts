export const ACTIONS = {
  CREATE: 'C',
  READ: 'R',
  UPDATE: 'U',
  DELETE: 'D',
  MANAGE: 'M',
  APPROVAL: 'A',
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
