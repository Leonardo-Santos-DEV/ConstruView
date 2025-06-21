import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Client from "../models/Client";
import { loginResponse } from "../interfaces/AuthInterfaces";
import { LoginPayload } from "../interfaces/AuthInterfaces";

export default class AuthService {
  static async me(authenticatedUser: loginResponse): Promise<loginResponse | null> {
    const { userId } = authenticatedUser;
    const user = await User.findByPk(userId, {
      include: [{ model: Client, as: 'client' }]
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.userId,
      userName: user.userName,
      isMasterAdmin: user.isMasterAdmin,
      clientId: user.clientId,
      clientName: (user as any).client.clientName,
    };
  }

  static async login(payload: LoginPayload): Promise<{ user: loginResponse, token: string }> {
    if (!process.env.JWT_SECRET) {
      console.error("Fatal Error: JWT_SECRET is not defined.");
      throw new Error('Internal server configuration error.');
    }

    const { email, password } = payload;
    const user = await User.findOne({
      where: { email: email, enabled: true },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const client = await Client.findByPk(user.clientId);
    const companyName = client ? client.clientName : '';

    const responsePayload: loginResponse = {
      userId: user.userId,
      userName: user.userName,
      isMasterAdmin: user.isMasterAdmin,
      clientId: user.clientId,
      clientName: companyName,
    };

    const token = jwt.sign(
      responsePayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { user: responsePayload, token };
  }
}
