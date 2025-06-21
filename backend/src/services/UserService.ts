import User from '../models/User';
import bcrypt from 'bcrypt';
import Project from "../models/Project";
import Permission from "../models/Permission";
import sequelize from '../config/database';
import { CreateUserPayload, UpdateUserPayload } from '../interfaces/UserInterfaces';

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

  static async create(data: CreateUserPayload) {
    const t = await sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user =  await User.create({...data, password: hashedPassword}, { transaction: t });

      const projects = await Project.findAll({where: {clientId: data.clientId}});

      await Promise.all(projects.map((project: Project) => {
        return Permission.create({
          userId: user.userId,
          projectId: project.projectId,
          level: 2,
        }, { transaction: t });
      }));

      await t.commit();
      return user;

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async update(id: number, data: UpdateUserPayload) {
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
