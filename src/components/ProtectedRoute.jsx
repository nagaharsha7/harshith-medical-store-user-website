import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function UserRoute() {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return null;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is owner, they shouldn't use user routes (or maybe they can, but typically they go to dashboard)
  // Let's allow owners to see user side, but protect User Profile etc.
  return <Outlet />;
}

export function OwnerRoute() {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return null;

  if (!currentUser || userRole !== 'owner') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
