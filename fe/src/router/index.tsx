import { createBrowserRouter } from 'react-router';
import PATHS from '~/constants/paths';
import ProtectedRoute from '~/router/guards/protected';
import RejectedRoute from '~/router/guards/rejected';
import AuthLayout from '~/views/layouts/auth';
import SidebarLayout from '~/views/layouts/sidebar';
import AbnormalA5Page from '~/views/pages/abnormal-a5/new-issue';
import LoginPage from '~/views/pages/auth/login';
import LoginWithCardPage from '~/views/pages/auth/login-with-card';
import ProfilePage from '~/views/pages/auth/profile';
import RolePage from '~/views/pages/role';
import VersionHistoryPage from '~/views/pages/version-history';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <SidebarLayout />,
        children: [
          {
            path: PATHS.HOME,
            element: <div>Hello</div>,
          },
          {
            path: PATHS.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: PATHS.VERSION_HISTORY,
            element: <VersionHistoryPage />,
          },
          {
            path: PATHS.A5,
            element: <AbnormalA5Page />,
          },
          {
            path: PATHS.ROLE,
            element: <RolePage />,
          },
        ],
      },
    ],
  },

  // =============== REJECTED ROUTES ===============
  {
    element: <RejectedRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: PATHS.LOGIN,
            element: <LoginPage />,
          },
          {
            path: PATHS.LOGIN_WITH_CARD,
            element: <LoginWithCardPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
