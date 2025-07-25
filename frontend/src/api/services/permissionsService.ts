import apiClient from '../apiClient';

export interface UpdatePermissionPayload {
  projectId: number;
  userId: number;
  level: number;
}

export const updatePermission = async (payload: UpdatePermissionPayload): Promise<any> => {
  try {
    return (await apiClient.put('/permissions', payload)).data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};
