export const ENDPOINTS = {
  AUTH: {
    PREFIX: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    LOGIN_WITH_CARD: '/login-with-card',
    ROLES: '/roles',
  },
  ISSUE: {
    PREFIX: '/issues',
    CREATE: '/',
  },
} as const;
