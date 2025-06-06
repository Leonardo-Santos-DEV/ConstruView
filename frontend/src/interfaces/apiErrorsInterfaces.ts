export interface APIError {
  message: string;
  statusCode?: number;
  isAuthError?: boolean;
}
