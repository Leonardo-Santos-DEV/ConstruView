export interface Project {
  projectId: number;
  projectName: string;
  clientId: number;
  imageUrl?: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  projectName: string;
  imageFile?: File;
  clientId: number;
}
