// CÓDIGO ATUALIZADO - COPIAR E COLAR
import apiClient from '../apiClient';
import type {Content, CreateContentPayload, GetContentsPayload, UpdateContentPayload} from '@/interfaces/contentInterfaces.ts';

export const getContentsByProjectAndCategory = async (payload: GetContentsPayload): Promise<Content[]> => {
  try {
    return (await apiClient.get<Content[]>(`contents/?projectId=${payload.projectId}&category=${payload.category}`)).data;
  } catch (error) {
    console.error(`Error fetching contents for project ${payload.projectId} and category ${payload.category}:`, error);
    throw error;
  }
};

export const getContentById = async (contentId: string): Promise<Content> => {
  try {
    return (await apiClient.get<Content>(`/contents/${contentId}`)).data;
  } catch (error) {
    console.error(`Error fetching content with ID ${contentId}:`, error);
    throw error;
  }
};

export const createContent = async (payload: CreateContentPayload): Promise<Content> => {
  const formData = new FormData();
  formData.append('projectId', String(payload.projectId));
  formData.append('category', payload.category);
  formData.append('contentName', payload.contentName);
  formData.append('url', payload.url);
  formData.append('date', payload.date);
  return (await apiClient.post<Content>('/contents', formData)).data;
};

export const updateContent = async (contentId: number, payload: UpdateContentPayload): Promise<Content> => {
  const formData = new FormData();

  if (payload.contentName) formData.append('contentName', payload.contentName);
  if (payload.url) formData.append('url', payload.url);
  if (payload.date) formData.append('date', payload.date);

  return (await apiClient.put<Content>(`/contents/${contentId}`, formData)).data;
};

export const deleteContent = async (contentId: number): Promise<void> => {
  await apiClient.delete(`/contents/${contentId}`);
};
