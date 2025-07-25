// CÓDIGO ATUALIZADO - COPIAR E COLAR
import apiClient from '../apiClient';
import type { Client, CreateClientPayload, UpdateClientPayload } from "@/interfaces/clientInterfaces.ts";

export const getAllClients = async (): Promise<Client[]> => {
  try {
    return (await apiClient.get<Client[]>('/clients')).data;
  } catch (error) {
    console.error('Error fetching all clients:', error);
    throw error;
  }
};

export const getClientById = async (clientId: number): Promise<Client> => {
  try {
    return (await apiClient.get<Client>(`/clients/${clientId}`)).data;
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    throw error;
  }
};

export const createClient = async (payload: CreateClientPayload): Promise<Client> => {
  try {
    return (await apiClient.post<Client>('/clients/', payload)).data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (clientId: number, payload: UpdateClientPayload): Promise<Client> => {
  try {
    return (await apiClient.put<Client>(`/clients/${clientId}`, payload)).data;
  } catch (error) {
    console.error(`Error updating client ${clientId}:`, error);
    throw error;
  }
};

export const setClientAdmin = async (clientId: number, userId: number): Promise<void> => {
  try {
    await apiClient.post(`/clients/${clientId}/admin`, { userId });
  } catch (error) {
    console.error(`Error setting client admin for client ${clientId}:`, error);
    throw error;
  }
};

export const disableClient = async (clientId: number): Promise<Client> => {
  try {
    return (await apiClient.delete(`/clients/${clientId}`)).data;
  } catch (error) {
    console.error(`Error disabling client ${clientId}:`, error);
    throw error;
  }
};
