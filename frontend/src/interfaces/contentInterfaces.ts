import type {Project} from "@/interfaces/projectInterfaces.ts";

export interface Content {
  contentId: number;
  projectId: number;
  category: string;
  contentName: string;
  url: string;
  previewImageUrl?: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  project: Project;
}

export interface GetContentsPayload {
  projectId: number;
  category: string;
}

export interface CreateContentPayload {
  projectId: number;
  category: '360view';
  contentName: string;
  url: string;
  previewImageFile: File;
}
