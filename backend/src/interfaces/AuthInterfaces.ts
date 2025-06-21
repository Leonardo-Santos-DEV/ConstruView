export interface LoginPayload {
  email: string;
  password: string;
}

export interface loginResponse {
  userId: number,
  userName: string,
  isMasterAdmin: boolean,
  clientId: number,
  clientName: string,
}
