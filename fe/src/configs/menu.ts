import { IconBook2, IconFileAlert, IconHelp, IconTimeline } from '@tabler/icons-react';
import { FEATURES } from 'shared/constants/features';
import type { NavItem } from '~/components/nav-main';
import PATHS from '~/constants/paths';

const MAIN_MENU: NavItem[] = [
  {
    title: 'navigation:issue',
    url: '',
    icon: IconFileAlert,
    children: [
      {
        title: 'navigation:issue_create',
        url: PATHS.NEW_ISSUE,
        featureCode: FEATURES.ISSUE,
      },
    ],
  },
];

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

const MENU = { MAIN_MENU, SECONDARY_MENU };

export default MENU;
