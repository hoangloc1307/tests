import { Navigate, Outlet, useLocation } from 'react-router';

export default function RejectedRoute() {
  const location = useLocation();
  const isAuthenticated = true;

  if (isAuthenticated) {
    const to = location.state?.from?.pathname;
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
