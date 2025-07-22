import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { loginResponse } from '../interfaces/AuthInterfaces';

export default class AuthController {
  static async me(req: Request, res: Response) {
    try {
      const userDetails: loginResponse | null = await AuthService.me(req.user);
      if (!userDetails) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(userDetails);
    } catch (error) {
      console.error('Error in /auth/me controller:', error);
      return res.status(500).json({ message: 'Server error while fetching user details' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.login(req.body);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.DOMAIN_NAME || undefined,
        path: '/',
      });

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(401).json({ message: error.message || 'Invalid credentials' });
    }
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.DOMAIN_NAME || undefined,
      path: '/',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
