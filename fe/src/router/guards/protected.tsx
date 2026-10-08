import { Navigate, Outlet, useLocation } from 'react-router';
import PATHS from '~/constants/paths';
import { useAuthStore } from '~/stores/auth';

export default function ProtectedRoute() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
