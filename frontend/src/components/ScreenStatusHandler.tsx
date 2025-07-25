// ATENÇÃO: Substitua completamente o conteúdo deste arquivo.

import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {APP_ROUTES} from '@/helpers/constants';
import {PageWrapper} from './PageWrapper';
import {AppNavigation} from './AppNavigation';
import {FullScreenLoader} from "@/components/FullScreenLoader.tsx";
import type {ScreenStatusHandlerProps} from "@/interfaces/componentsInterfaces.ts";
import {FaSignInAlt, FaExclamationTriangle} from "react-icons/fa";

function ScreenStatusHandler<TData>({
                                      isLoading: isLoadingScreenData, error: screenError, data: screenData,
                                      navItems = [], notFoundMessage = "Resource not found.", children
                                    }: ScreenStatusHandlerProps<TData>) {

  const {isAuthenticated, isLoading: isLoadingAuth, logoutUser} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      navigate(APP_ROUTES.LOGIN, {replace: true});
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  if (isLoadingAuth || isLoadingScreenData) {
    return <FullScreenLoader/>;
  }

  if (!isAuthenticated) {
    return <FullScreenLoader/>;
  }

  // ---- INÍCIO DA ALTERAÇÃO ----
  if (screenError) {
    // Se for erro de autenticação, pede para logar novamente.
    if (screenError.isAuthError) {
      return (
        <PageWrapper>
          <div className="flex flex-col items-center justify-center text-center h-full flex-grow p-4">
            <h2 className="text-2xl font-bold text-white mb-2">Sessão Expirada</h2>
            <p className="text-slate-300 mb-6">Sua sessão expirou. Por favor, faça o login novamente.</p>
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <FaSignInAlt/>
              Ir para o Login
            </button>
          </div>
        </PageWrapper>
      )
    }
    // Se for erro de "Não Encontrado" ou "Acesso Negado", mostra a mensagem amigável.
    else if (screenError.statusCode === 404 || screenError.statusCode === 403) {
      return (
        <PageWrapper hasSidebar={navItems.length > 0}>
          {navItems.length > 0 && <AppNavigation items={navItems}/>}
          <div className="md:ml-56 lg:ml-64 p-4 text-center flex flex-col items-center justify-center flex-grow">
            <FaExclamationTriangle size={48} className="text-amber-400 mb-4"/>
            <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-slate-300 text-lg">{notFoundMessage}</p>
          </div>
        </PageWrapper>
      );
    }
    // Para todos os outros erros, mostra a tela vermelha genérica.
    else {
      return (
        <PageWrapper hasSidebar={navItems.length > 0}>
          {navItems.length > 0 && <AppNavigation items={navItems}/>}
          <div className="md:ml-56 lg:ml-64 p-4 text-center text-red-400 flex flex-col items-center justify-center flex-grow">
            <p className="font-semibold text-lg">Ocorreu um erro inesperado:</p>
            <p>{screenError.message}</p>
          </div>
        </PageWrapper>
      );
    }
  }
  // ---- FIM DA ALTERAÇÃO ----


  if (!isLoadingScreenData && (screenData === null || screenData === undefined)) {
    return (
      <PageWrapper hasSidebar={navItems.length > 0}>
        {navItems.length > 0 && <AppNavigation items={navItems}/>}
        <div className="md:ml-56 lg:ml-64 p-4 text-center text-slate-300 flex flex-col items-center justify-center flex-grow">
          <p className="text-lg">{notFoundMessage}</p>
        </div>
      </PageWrapper>
    );
  }

  return <>{children(screenData!)}</>; // Usamos ! pois já verificamos se é nulo ou indefinido
}

export default ScreenStatusHandler;
