import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { APP_ROUTES } from "@/helpers/constants";
import { PageWrapper } from "./PageWrapper";
import { AppNavigation } from "./AppNavigation";
import { FullScreenLoader } from "@/components/FullScreenLoader.tsx";
import type { ScreenStatusHandlerProps } from "@/interfaces/componentsInterfaces.ts";
import { FaSignInAlt } from "react-icons/fa";

function ScreenStatusHandler<TData>({
  isLoading: isLoadingScreenData,
  error: screenError,
  data: screenData,
  navItems = [],
  notFoundMessage = "Resource not found.",
  requireAuth = true,
  children,
}: ScreenStatusHandlerProps<TData>) {
  const { isAuthenticated, isLoading: isLoadingAuth, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isLoadingAuth && !isAuthenticated) {
      navigate(APP_ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  if (isLoadingScreenData) {
    return <FullScreenLoader />;
  }

  if (requireAuth && !isAuthenticated) {
    return <FullScreenLoader />;
  }

  if (screenError) {
    if (screenError.isAuthError) {
      return (
        <PageWrapper>
          <div className="flex flex-col items-center justify-center text-center h-full flex-grow p-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              Sessão Expirada
            </h2>
            <p className="text-slate-300 mb-6">
              Sua sessão expirou ou você não tem permissão. Por favor, faça o
              login novamente.
            </p>
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <FaSignInAlt />
              Ir para o Login
            </button>
          </div>
        </PageWrapper>
      );
    } else {
      return (
        <PageWrapper hasSidebar={navItems.length > 0}>
          {navItems.length > 0 && <AppNavigation items={navItems} />}
          <div className="md:ml-56 lg:ml-64 p-4 text-center text-red-500 flex flex-col items-center justify-center flex-grow">
            <p className="font-semibold text-lg">An error occurred:</p>
            <p>{screenError.message}</p>
          </div>
        </PageWrapper>
      );
    }
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
