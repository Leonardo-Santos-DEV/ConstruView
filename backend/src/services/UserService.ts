import User from '../models/User';
import bcrypt from 'bcrypt';
import Project from "../models/Project";
import Permission from "../models/Permission";

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
    const user =  await User.create({...data, password: hashedPassword});

    const projects = await Project.findAll({where: {clientId: data.clientId}});

    await Promise.all(projects.map((project: Project) => {
      return Permission.create({
        userId: user.userId,
        projectId: project.projectId,
        level: 2,
      })
    }))
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
