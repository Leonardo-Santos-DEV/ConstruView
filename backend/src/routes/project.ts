import { Router } from 'express';
import ProjectController from "../controllers/ProjectController";
import { authMiddleware } from '../middlewares/authMiddleware';
import {permissionMiddleware} from "../middlewares/permissionMiddleware";
import multer from "multer";

const router = Router();

router.use(authMiddleware);

const storage = multer.memoryStorage();

const uploadMiddleware = multer({ storage: storage });

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.post('/', permissionMiddleware(2), uploadMiddleware.single('imageFile'), ProjectController.create);
router.put('/:id', permissionMiddleware(2), uploadMiddleware.single('imageFile'), ProjectController.update);
router.delete('/:id', permissionMiddleware(2), ProjectController.disable);

export default router;
