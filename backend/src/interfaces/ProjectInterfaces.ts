export interface Project {
  projectId: number;
  projectName: string;
  imageUrl: string;
  clientId: number;
  enabled: boolean;
  permissionLevel?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProjectPayload {
  projectName: string;
  clientId: number;
  imageUrl: string;
}

export interface UpdateProjectPayload {
  projectName?: string;
  imageUrl?: string;
  enabled?: boolean;
}
