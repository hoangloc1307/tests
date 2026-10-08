import { Navigate, Outlet, useLocation } from 'react-router';
import PATHS from '~/constants/paths';
import { useAuthStore } from '~/stores/auth';

export default function RejectedRoute() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    const to = location.state?.from?.pathname ?? PATHS.HOME;
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
