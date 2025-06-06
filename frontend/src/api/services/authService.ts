import apiClient from '../apiClient';
import type {AuthenticatedUser, LoginPayload, LogoutResponse} from "@/interfaces/authInterfaces.ts";

export const login = async (payload: LoginPayload): Promise<AuthenticatedUser> => {
  return (await apiClient.post<AuthenticatedUser>('/auth/login', payload)).data;
};

export const logout = async (): Promise<LogoutResponse> => {
  return (await apiClient.post<LogoutResponse>('/auth/logout')).data;
};

export const checkAuthStatus = async (): Promise<AuthenticatedUser | null> => {
  try {
    return (await apiClient.get<AuthenticatedUser>('/auth/me')).data;
  } catch (error) {
    return null;
  }
};
