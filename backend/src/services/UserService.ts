import { Op } from 'sequelize'; // ADICIONAR IMPORTAÇÃO DO 'Op'
import User from '../models/User';
import bcrypt from 'bcrypt';
import Project from "../models/Project"; // ADICIONAR IMPORTAÇÃO DO MODEL 'Project'
import Permission from "../models/Permission";
import sequelize from '../config/database';
import { CreateUserPayload, UpdateUserPayload } from '../interfaces/UserInterfaces';
import { PERMISSION_LEVELS } from "../helpers/permissionLevels";

export default class UserService {
  // ... métodos getAll, getById, create, update e delete permanecem os mesmos ...
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

  static async create(data: CreateUserPayload): Promise<User> {
    const t = await sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const userData = { ...data, password: hashedPassword, isClientAdmin: false };
      const user = await User.create(userData, { transaction: t });

      const projects = await Project.findAll({ where: { clientId: data.clientId } });
      await Promise.all(projects.map((project: Project) => {
        return Permission.create({
          userId: user.userId,
          projectId: project.projectId,
          level: PERMISSION_LEVELS.VIEWER,
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

    if (data.isClientAdmin !== undefined) {
      delete data.isClientAdmin;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    return user;
  }

  static async setClientAdmin(clientId: number, newAdminUserId: number): Promise<User> {
    const t = await sequelize.transaction();
    try {
      const newAdmin = await User.findByPk(newAdminUserId);
      if (!newAdmin || newAdmin.clientId !== clientId) {
        throw { statusCode: 404, message: 'New admin user not found in this client.' };
      }

      const oldAdmin = await User.findOne({ where: { clientId, isClientAdmin: true }, transaction: t });

      if (oldAdmin) {
        if (oldAdmin.userId === newAdminUserId) {
          await t.commit();
          return oldAdmin;
        }
        oldAdmin.isClientAdmin = false;
        await oldAdmin.save({ transaction: t });

        await Permission.update(
          { level: PERMISSION_LEVELS.PROJECT_MANAGER },
          { where: { userId: oldAdmin.userId }, transaction: t }
        );
      }

      newAdmin.isClientAdmin = true;
      await newAdmin.save({ transaction: t });

      // ---- INÍCIO DA CORREÇÃO ----
      // 1. Buscar todos os IDs de projeto para o cliente.
      const clientProjects = await Project.findAll({
        where: { clientId },
        attributes: ['projectId'],
        transaction: t
      });
      const projectIds = clientProjects.map(p => p.projectId);

      // 2. Usar a lista de IDs de projeto para atualizar as permissões do novo admin.
      if (projectIds.length > 0) {
        await Permission.update(
          { level: PERMISSION_LEVELS.PROJECT_MANAGER },
          {
            where: {
              userId: newAdmin.userId,
              projectId: {
                [Op.in]: projectIds // Filtra pelos projetos do cliente
              }
            },
            transaction: t
          }
        );
      }
      // ---- FIM DA CORREÇÃO ----

      await t.commit();
      return newAdmin;

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async delete(id: number) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return user;
  }
}
