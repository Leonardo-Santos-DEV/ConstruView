import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { APP_ROUTES } from '@/helpers/constants';
import {FullScreenLoader} from "@/components/FullScreenLoader.tsx";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={APP_ROUTES.LOGIN} replace />;
}
