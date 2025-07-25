import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import ClientController from '../controllers/ClientController';
import {permissionMiddleware} from "../middlewares/permissionMiddleware";

const router = Router();

router.use(authMiddleware);

router.get('/', permissionMiddleware(2), ClientController.getAll);
router.get('/:id', permissionMiddleware(2), ClientController.getById);
router.post('/', permissionMiddleware(2), ClientController.create);
router.put('/:id', permissionMiddleware(2), ClientController.update);
router.delete('/:id', permissionMiddleware(2), ClientController.disable);
router.post('/:id/admin', permissionMiddleware(3), ClientController.setClientAdmin);

export default router;
