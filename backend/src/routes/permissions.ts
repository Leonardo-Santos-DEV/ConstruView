import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import PermissionController from '../controllers/PermissionsController';
import { permissionMiddleware } from '../middlewares/permissionMiddleware';
import { PERMISSION_LEVELS } from '../helpers/permissionLevels';

const router = Router();

router.use(authMiddleware);

router.put('/', permissionMiddleware(PERMISSION_LEVELS.PROJECT_MANAGER), PermissionController.updatePermission);

router.get('/', permissionMiddleware(PERMISSION_LEVELS.PROJECT_MANAGER), PermissionController.getPermissions);

export default router;
