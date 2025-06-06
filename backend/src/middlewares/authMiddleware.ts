import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {loginResponse} from "../interfaces/AuthInterfaces";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Token not provided' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as loginResponse;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
