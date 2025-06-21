import { Request, Response, NextFunction } from 'express';
import { hasPermission } from '../helpers/hasPermission';
import { loginResponse as AuthenticatedUserPayload } from '../interfaces/AuthInterfaces';


export function permissionMiddleware(requiredLevel: number) {
  return async (req: Request & { user?: AuthenticatedUserPayload }, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'User not authenticated for permission check.' });
    }

    if (user.isMasterAdmin) {
      return next();
    }

    let projectIdToParse: string | undefined;
    if (req.query && req.query.projectId) {
      projectIdToParse = req.query.projectId as string;
    } else if (req.params && req.params.id) {
      projectIdToParse = req.params.id;
    } else if (req.params && req.params.projectId) {
      projectIdToParse = req.params.projectId;
    } else if (req.body && req.body.projectId) {
      projectIdToParse = req.body.projectId.toString();
    }

    let projectId: number | undefined = undefined;
    if (projectIdToParse) {
      projectId = parseInt(projectIdToParse, 10);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: 'Invalid Project ID format for permission check.' });
      }
    }

    try {
      const canAccess = await hasPermission(user.userId, projectId, requiredLevel);
      if (!canAccess) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    } catch (permissionError) {
      console.error("Error during permission check:", permissionError);
      return next(permissionError);
    }
  };
}
