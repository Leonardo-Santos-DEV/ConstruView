import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { APP_ROUTES } from '@/helpers/constants';
import { FullScreenLoader } from './FullScreenLoader';

export const AdminRouteVerify: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated && user?.isMasterAdmin) {
    return <Outlet />;
  }

  return <Navigate to={APP_ROUTES.PROJECTS} replace />;
};
