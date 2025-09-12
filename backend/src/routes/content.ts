import { Router } from 'express';
import ContentController from '../controllers/ContentController';
import ShareController from '../controllers/ShareController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissionMiddleware } from "../middlewares/permissionMiddleware";

const router = Router();

router.post('/share', authMiddleware, ShareController.create);

router.use(authMiddleware);

router.get('/', ContentController.getAll);
router.get('/:id', ContentController.getById);
router.post('/', permissionMiddleware(2), ContentController.create);
router.put('/:id', permissionMiddleware(2), ContentController.update);
router.delete('/:id', permissionMiddleware(2), ContentController.disable);

export default router;