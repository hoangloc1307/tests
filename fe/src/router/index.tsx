import { createBrowserRouter } from 'react-router';
import PATHS from '~/constants/paths';
import ProtectedRoute from '~/router/guards/protected';
import RejectedRoute from '~/router/guards/rejected';
import AuthLayout from '~/views/layouts/auth';
import SidebarLayout from '~/views/layouts/sidebar';
import LoginPage from '~/views/pages/auth/login';
import ProfilePage from '~/views/pages/auth/profile';

const router = createBrowserRouter([
  {
    element: <SidebarLayout />,
    children: [
      // =============== PUBLIC ROUTES ===============
      {
        path: PATHS.HOME,
        element: <div>Hello</div>,
      },

      // =============== PROTECTED ROUTES ===============
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PATHS.PROFILE,
            element: <ProfilePage />,
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
