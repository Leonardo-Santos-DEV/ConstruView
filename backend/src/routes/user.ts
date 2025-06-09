import { Router } from 'express';
import UserController from "../controllers/UserController";
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissionMiddleware } from '../middlewares/permissionMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', permissionMiddleware(2), UserController.getAll);
router.get('/:id', permissionMiddleware(2), UserController.getById);
router.post('/', permissionMiddleware(2), UserController.create);
router.put('/:id', permissionMiddleware(2), UserController.update);
router.delete('/:id', permissionMiddleware(2), UserController.delete);

export default router;
