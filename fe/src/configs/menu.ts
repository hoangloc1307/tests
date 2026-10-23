import {
  IconBook2,
  IconFileAlert,
  IconHelp,
  IconSettings,
  IconTimeline,
} from '@tabler/icons-react';
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
  {
    title: 'navigation:settings',
    url: '',
    icon: IconSettings,
    children: [
      {
        title: 'navigation:settings_role',
        url: PATHS.ROLE,
        featureCode: FEATURES.ROLE,
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
