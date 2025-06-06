import apiClient from '../apiClient';
import type {Content, CreateContentPayload, GetContentsPayload} from '@/interfaces/contentInterfaces.ts';

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
  formData.append('previewImageFile', payload.previewImageFile);

  try {
    return (await apiClient.post<Content>('/contents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};
