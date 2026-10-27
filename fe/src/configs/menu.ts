import {
  IconBook2,
  IconClipboardList,
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
        url: PATHS.A5,
        featureCode: FEATURES.ISSUE_A5,
      },
    ],
  },
  {
    title: 'navigation:task',
    url: PATHS.TASK,
    icon: IconClipboardList,
    featureCode: FEATURES.TASK,
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
    title: 'navigation:guide',
    url: '/',
    icon: IconBook2,
  },
  {
    title: 'navigation:support',
    url: '/',
    icon: IconHelp,
  },
  {
    title: 'navigation:version_history',
    url: PATHS.VERSION_HISTORY,
    icon: IconTimeline,
  },
];

const MENU = { MAIN_MENU, SECONDARY_MENU };

export default MENU;
