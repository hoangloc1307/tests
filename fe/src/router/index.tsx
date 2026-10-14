import { createBrowserRouter } from 'react-router';
import PATHS from '~/constants/paths';
import ProtectedRoute from '~/router/guards/protected';
import RejectedRoute from '~/router/guards/rejected';
import AuthLayout from '~/views/layouts/auth';
import SidebarLayout from '~/views/layouts/sidebar';
import LoginPage from '~/views/pages/auth/login';
import ProfilePage from '~/views/pages/auth/profile';
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
        ],
      },
    ],
  },
]);

export default router;
