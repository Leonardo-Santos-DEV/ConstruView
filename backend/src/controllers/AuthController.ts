import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export default class AuthController {
  static async me(req: Request, res: Response) {
    return AuthService.me(req, res);
  }

  static async login(req: Request, res: Response) {
    return AuthService.login(req, res);
  }

  static async logout(req: Request, res: Response) {
    return AuthService.logout(req, res);
  }
}
