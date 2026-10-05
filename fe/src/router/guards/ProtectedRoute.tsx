import { Navigate, Outlet, useLocation } from 'react-router';

export default function ProtectedRoute() {
  const isAuthenticated = false;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
