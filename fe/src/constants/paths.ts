import { DOCUMENT_TYPE } from 'shared/schemas/issue';

const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  LOGIN_WITH_CARD: '/login-with-card',
  PROFILE: '/profile',
  VERSION_HISTORY: '/version-history',
  ROLE: '/role',
  A5: `/${DOCUMENT_TYPE.A5.toLocaleLowerCase()}`,
} as const;

export default PATHS;
