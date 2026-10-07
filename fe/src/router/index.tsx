import { createBrowserRouter } from 'react-router';
import PATHS from '~/constants/paths';
import RejectedRoute from '~/router/guards/RejectedRoute';
import AuthLayout from '~/views/layouts/auth';
import SidebarLayout from '~/views/layouts/sidebar';
import LoginPage from '~/views/pages/auth/login/login';

const router = createBrowserRouter([
  {
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <div>Hello</div>,
      },
    ],
  },
  // =============== REJECTED ROUTE ===============
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
