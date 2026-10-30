export const ENDPOINTS = {
  AUTH: {
    PREFIX: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    LOGIN_WITH_CARD: '/login-with-card',
    REFRESH: '/refresh',
    ROLES: '/roles',
  },
  ISSUE: {
    PREFIX: '/issues',
    CREATE_A5: '/a5',
  },
  TASK: {
    PREFIX: '/tasks',
    LIST: '/',
    DETAIL: '/:documentId/:taskId',
  },
  JOB: {
    PREFIX: '/jobs',
    HOLDING_LIST: '/holding',
    DETAIL: '/:jobOrderNo',
  },
} as const;
