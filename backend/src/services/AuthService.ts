import {Request, Response} from 'express';
import {Op} from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Client from "../models/Client";
import {loginResponse} from "../interfaces/AuthInterfaces";

export default class AuthService {
  static async me(req: Request, res: Response) {
    try {
      const {userId, clientId} = req.user;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      let companyName = null;
      const client = await Client.findByPk(clientId);
      if (client) {
        companyName = client.clientName;
      }

      const response: loginResponse = {
        userId: user.userId,
        userName: user.userName,
        isMasterAdmin: user.isMasterAdmin,
        clientId: clientId,
        clientName: companyName,
      };

      return res.status(200).json(response);

    } catch (error) {
      console.error('Error in /auth/me route:', error);
      return res.status(500).json({message: 'Server error while fetching user details'});
    }
  }

  static async login(req: Request, res: Response) {
    const {email, password} = req.body;

    const user = await User.findOne({
      where: {
        email: email,
        enabled: true,
      },
    });

    if (!user) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    let companyName = null;
    const client = await Client.findByPk(user.clientId);
    if (client) {
      companyName = client.clientName;
    }

    const response: loginResponse = {
      userId: user.userId,
      userName: user.userName,
      isMasterAdmin: user.isMasterAdmin,
      clientId: user.clientId,
      clientName: companyName,
    }

    const token = jwt.sign(
      response,
      process.env.JWT_SECRET || 'default_secret',
      {expiresIn: '1h'}
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res.status(200).json(response);
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie('token');
    return res.status(201).json({message: 'Logged out successfully'});
  }
}
