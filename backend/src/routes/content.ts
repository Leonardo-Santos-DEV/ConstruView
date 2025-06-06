import { Router } from 'express';
import ContentController from '../controllers/ContentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import {permissionMiddleware} from "../middlewares/permissionMiddleware";
import multer from "multer";

const router = Router();

router.use(authMiddleware);

const storage = multer.memoryStorage();

const uploadMiddleware = multer({ storage: storage });

router.use(authMiddleware);
router.get('/', permissionMiddleware(1), ContentController.getAll);
router.get('/:id', permissionMiddleware(1), ContentController.getById);
router.post('/', permissionMiddleware(2),uploadMiddleware.single('previewImageFile'), ContentController.create);
router.put('/:id', permissionMiddleware(2), ContentController.update);
router.delete('/:id', permissionMiddleware(2), ContentController.disable);

export default router;
