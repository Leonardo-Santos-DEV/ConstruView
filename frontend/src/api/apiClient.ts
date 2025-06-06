import axios, { AxiosError, type AxiosResponse } from 'axios';
import type {APIError} from "@/interfaces/apiErrorsInterfaces.ts";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<APIError>) => {
    if (error.response) {

      if (error.response.status === 401) {
        const authError: APIError = {
          message: error.response.data?.message || 'Unauthorized. Please log in.',
          statusCode: 401,
          isAuthError: true,
        };
        return Promise.reject(authError);
      }

      const apiError: APIError = {
        message: error.response.data?.message || error.message || 'An unexpected error occurred.',
        statusCode: error.response.status,
      };
      return Promise.reject(apiError);

    } else if (error.request) {
      console.error('API No Response:', error.request);
      const networkError: APIError = {
        message: 'Could not connect to the server. Please check your internet connection.',
      };
      return Promise.reject(networkError);
    } else {
      console.error('API Request Setup Error:', error.message);
      const requestSetupError: APIError = {
        message: `Error setting up request: ${error.message}`,
      };
      return Promise.reject(requestSetupError);
    }
  }
);

export default apiClient;
