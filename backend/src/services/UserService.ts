import User from '../models/User';
import bcrypt from 'bcrypt';
import {Request, Response} from "express";

export default class UserService {
  static async getAll(clientId: number | null) {
    if (clientId && !isNaN(clientId)) {
      return User.findAll({where: {clientId}});
    } else {
      return User.findAll();
    }
  }

  static async getById(id: number) {
    return User.findByPk(id);
  }

  static async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await User.create({...data, password: hashedPassword});
  }

  static async update(id: number, data: any) {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    return user;
  }

  static async delete(id: number) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return user;
  }
}
