import apiClient from '../apiClient';
import type { User, CreateUserPayload, UpdateUserPayload } from "@/interfaces/userInterfaces.ts";

export const getUsersByClientId = async (clientId: number): Promise<User[]> => {
  try {
    return (await apiClient.get<User[]>(`/users?clientId=${clientId}`)).data;
  } catch (error) {
    console.error(`Error fetching users for client ${clientId}:`, error);
    throw error;
  }
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  try {
    return (await apiClient.post<User>('/users', payload)).data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: number, payload: UpdateUserPayload): Promise<User> => {
  try {
    return (await apiClient.put<User>(`/users/${userId}`, payload)).data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};
