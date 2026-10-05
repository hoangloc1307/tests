import { createBrowserRouter } from 'react-router';
import SidebarLayout from '~/views/layouts/sidebar';

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
]);

export default router;
