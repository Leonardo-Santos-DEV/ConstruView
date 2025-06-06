export interface User {
  userId: number;
  clientId: number;
  userName: string;
  email: string;
  isMasterAdmin: boolean;
  enabled: boolean;
}

export interface CreateUserPayload {
  clientId: number;
  userName: string;
  email: string;
  password?: string;
}

export interface UpdateUserPayload {
  userName?: string;
  email?: string;
  password?: string;
  enabled?: boolean;
}
