import React, {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  login as apiLoginServiceCall,
  logout as apiLogout,
  checkAuthStatus as apiCheckAuthStatus
} from '@/api/services/authService';
import type {AuthenticatedUser, LoginPayload} from '@/interfaces/authInterfaces.ts';
import {APP_ROUTES} from '@/helpers/constants';
import type {AuthContextInterface} from "@/interfaces/contextInterfaces.ts";

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyExistingSession = async () => {
      setIsLoading(true);
      try {
        const currentUser = await apiCheckAuthStatus();
        console.log('2. [AuthContext] Resposta da API (apiCheckAuthStatus):', currentUser);
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('AuthContext: No active session or error checking auth status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    verifyExistingSession().catch((error) => {
      console.error('AuthContext: Error during initial auth check:', error);
      setIsLoading(false);
    });
  }, []);

  const loginUser = async (payload: LoginPayload): Promise<AuthenticatedUser> => {
    setIsLoading(true);
    try {
      const apiResponse: AuthenticatedUser = await apiLoginServiceCall(payload);

      setUser(apiResponse);
      setIsLoading(false);
      return apiResponse;
    } catch (error) {
      setIsLoading(false);
      console.error("AuthContext: Login failed", error);
      setUser(null);
      throw error;
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error("AuthContext: API Logout failed", error);
    } finally {
      setUser(null);
      setIsLoading(false);
      navigate(APP_ROUTES.LOGIN);
    }
  };

  return (
    <AuthContext.Provider value={{user, isAuthenticated: !!user, isLoading, loginUser, logoutUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
