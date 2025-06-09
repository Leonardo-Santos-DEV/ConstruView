import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { APP_ROUTES } from '@/helpers/constants';
import {FullScreenLoader} from "@/components/FullScreenLoader.tsx";

export function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />
  }

  return isAuthenticated ? (
    <Navigate to={APP_ROUTES.PROJECTS} replace />
  ) : (
    <Navigate to={APP_ROUTES.LOGIN} replace />
  );
}
