import { Request, Response } from 'express';
import PermissionService from '../services/PermissionsService';
import ProjectService from "../services/ProjectService";

export default class PermissionController {
  static async updatePermission(req: Request, res: Response) {
    try {
      const { projectId, userId, level } = req.body;
      const actingUser = req.user!;

      if (!projectId || !userId || level === undefined) {
        return res.status(400).json({ message: 'projectId, userId, and level are required.' });
      }

      const permission = await PermissionService.updateUserPermissionForProject(
        actingUser,
        Number(projectId),
        Number(userId),
        Number(level)
      );

      return res.status(200).json(permission);

    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  static async getPermissions(req: Request, res: Response) {
    try {
      const { projectId } = req.query;
      if (!projectId) {
        return res.status(400).json({ message: 'projectId is required.' });
      }

      // Precisamos do clientId para buscar os usuários corretos
      const project = await ProjectService.getById(Number(projectId), req.user!);
      if (!project) {
        return res.status(404).json({ message: 'Project not found or no permission to view.' });
      }

      const permissions = await PermissionService.getPermissionsForProject(Number(projectId), project.clientId);
      return res.status(200).json(permissions);

    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
