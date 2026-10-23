export const ENDPOINTS = {
  AUTH: {
    PREFIX: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    LOGIN_WITH_CARD: '/login-with-card',
    ROLE: '/role',
  },
  ISSUE: {
    PREFIX: '/issues',
    CREATE: '/',
  },
} as const;
