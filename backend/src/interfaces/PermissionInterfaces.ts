export interface Permission {
  permissionId: number;
  userId: number;
  projectId: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}
