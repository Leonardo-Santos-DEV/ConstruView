import type {AuthenticatedUser, LoginPayload} from "@/interfaces/authInterfaces.ts";

export interface AuthContextInterface {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (payload: LoginPayload) => Promise<AuthenticatedUser>;
  logoutUser: () => Promise<void>;
}
