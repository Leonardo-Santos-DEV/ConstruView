import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.get('/me', authMiddleware, AuthController.me);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

export default router;
