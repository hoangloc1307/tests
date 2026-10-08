import { IconBook2, IconHelp, IconTimeline } from '@tabler/icons-react';
import PATHS from '~/constants/paths';

const SECONDARY_MENU = [
  {
    title: 'guide',
    url: '/',
    icon: IconBook2,
  },
  {
    title: 'support',
    url: '/',
    icon: IconHelp,
  },
  {
    title: 'version_history',
    url: PATHS.VERSION_HISTORY,
    icon: IconTimeline,
  },
];

const MENU = { SECONDARY_MENU };

export default MENU;
