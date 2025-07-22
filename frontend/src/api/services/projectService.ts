import apiClient from '../apiClient';
import type {CreateProjectPayload, Project, UpdateProjectPayload} from "@/interfaces/projectInterfaces.ts";

export const getAllProjects = async (): Promise<Project[]> => {

  try {
    return (await apiClient.get<Project[]>('/projects/')).data;
  } catch (error) {
    console.error('Error fetching projects by client:', error);
    throw error;
  }
};

export const getProject = async (projectId: number): Promise<Project> => {
  try {
    return (await apiClient.get<Project>(`/projects/?projectId=${projectId}`)).data;
  } catch (error) {
    console.error(`Error fetching project:`, error);
    throw error;
  }
};

export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const formData = new FormData();

  formData.append('projectName', payload.projectName);
  formData.append('clientId', String(payload.clientId));

  if (payload.imageFile) {
    formData.append('imageFile', payload.imageFile);
  }

  try {
    return (await apiClient.post<Project>('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (projectId: number, payload: UpdateProjectPayload): Promise<void> => {
  const formData = new FormData();

  if (payload.projectName) {
    formData.append('projectName', payload.projectName);
  }
  if (payload.imageFile) {
    formData.append('imageFile', payload.imageFile);
  }

  try {
    await apiClient.put(`/projects/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    await apiClient.delete(`/projects/${projectId}`);
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    throw error;
  }
};
