export interface LoginPayload {
  email: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthenticatedUser {
  userId: number,
  userName: string,
  isMasterAdmin: boolean,
  clientId: number,
  clientName: string,
}
