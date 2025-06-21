import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {loginResponse} from "../interfaces/AuthInterfaces";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!process.env.JWT_SECRET) {
    console.error("Fatal Error: JWT_SECRET is not defined.");
    return res.status(500).json({ error: 'Internal server configuration error.' });
  }

  if (req.method === 'OPTIONS') {
    return next();
  }

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Token not provided' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as loginResponse;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
