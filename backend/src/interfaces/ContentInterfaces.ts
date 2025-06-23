import { Project } from './ProjectInterfaces';

export interface GetContentsPayload {
  projectId: number;
  category?: string;
}

export interface CreateContentPayload {
  projectId: number;
  category: string;
  contentName: string;
  url: string;
  date: string;
}

export interface UpdateContentPayload {
  contentName?: string;
  url?: string;
  date: string;
  enabled?: boolean;
}

export interface Content {
  contentId: number;
  projectId: number;
  category: string;
  contentName: string;
  url: string;
  date: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
}
