import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { APP_ROUTES } from '@/helpers/constants';
import { PageWrapper } from './PageWrapper';
import { AppNavigation } from './AppNavigation';
import { FullScreenLoader } from "@/components/FullScreenLoader.tsx";
import type {ScreenStatusHandlerProps} from "@/interfaces/componentsInterfaces.ts";

function ScreenStatusHandler<TData>({isLoading: isLoadingScreenData, error: screenError, data: screenData,
                                      navItems = [], notFoundMessage = "Resource not found.", children}: ScreenStatusHandlerProps<TData>) {

  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      navigate(APP_ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  if (isLoadingAuth || isLoadingScreenData) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <FullScreenLoader />;
  }

  if (screenError) {
    return (
      <PageWrapper hasSidebar={navItems.length > 0}>
        {navItems.length > 0 && <AppNavigation items={navItems} />}
        <div className="md:ml-56 lg:ml-64 p-4 text-center text-red-500 flex flex-col items-center justify-center flex-grow">
          <p className="font-semibold text-lg">An error occurred:</p>
          <p>{screenError}</p>
        </div>
      </PageWrapper>
    );
  }

  if (screenData === null || screenData === undefined) {
    return (
      <PageWrapper hasSidebar={navItems.length > 0}>
        {navItems.length > 0 && <AppNavigation items={navItems} />}
        <div className="md:ml-56 lg:ml-64 p-4 text-center text-slate-300 flex flex-col items-center justify-center flex-grow">
          <p className="text-lg">{notFoundMessage}</p>
        </div>
      </PageWrapper>
    );
  }

  return <>{children(screenData)}</>;
}

export default ScreenStatusHandler;
