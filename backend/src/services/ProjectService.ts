// ATENÇÃO: Substitua o arquivo inteiro para garantir que todas as importações e lógicas estejam corretas.

import { Op } from 'sequelize';
import Project from "../models/Project";
import Permission from "../models/Permission";
import User from "../models/User";
import sequelize from '../config/database';
import { CreateProjectPayload, UpdateProjectPayload } from '../interfaces/ProjectInterfaces';
import { loginResponse as AuthenticatedUser } from '../interfaces/AuthInterfaces';
import { uploadImageToCloudinary } from "../helpers/uploadImageToCloudinary";
import { PERMISSION_LEVELS } from "../helpers/permissionLevels";

export default class ProjectService {

  static async getAll(user: AuthenticatedUser): Promise<Project[]> {
    if (user.isMasterAdmin) {
      return Project.findAll({ where: { enabled: true } });
    }

    // CORREÇÃO: Busca apenas os projetos onde o usuário tem um nível de permissão maior que 0.
    const permissions = await Permission.findAll({
      where: {
        userId: user.userId,
        level: {
          [Op.gt]: 0 // Op.gt significa "greater than" (maior que)
        }
      },
      attributes: ['projectId']
    });

    if (permissions.length === 0) {
      return []; // Se não tem permissões, retorna uma lista vazia.
    }

    const projectIds = permissions.map(p => p.projectId);

    return Project.findAll({
      where: {
        projectId: {
          [Op.in]: projectIds
        },
        enabled: true
      }
    });
  }

  static async getById(projectId: number, user: AuthenticatedUser): Promise<Project | null> {
    const whereClause: any = {
      projectId: projectId,
      enabled: true
    };

    if (!user.isMasterAdmin) {
      // Esta verificação de clientId é uma segunda camada de segurança.
      whereClause.clientId = user.clientId;
    }

    const project = await Project.findOne({ where: whereClause, raw: true });

    if (!project) {
      return null;
    }

    const permission = await Permission.findOne({
      where: { userId: user.userId, projectId: project.projectId }
    });

    const permissionLevel = user.isMasterAdmin ? 99 : (permission ? permission.level : 0);

    // CORREÇÃO: Se o nível de permissão for 0 (Sem Acesso), trata como se o projeto não fosse encontrado.
    // Isso impede o acesso direto via URL.
    if (permissionLevel < PERMISSION_LEVELS.VIEWER) {
      return null;
    }

    (project as any).permissionLevel = permissionLevel;

    return project;
  }

  // O restante dos métodos (create, update, disable) permanece o mesmo do seu arquivo original
  static async create(payload: CreateProjectPayload): Promise<Project> {
    const t = await sequelize.transaction();
    try {
      const newProject = await Project.create({
        ...payload,
        enabled: true
      }, { transaction: t });

      const users = await User.findAll({ where: { clientId: payload.clientId } });

      await Promise.all(users.map((user: User) => {
        return Permission.create({
          userId: user.userId,
          projectId: newProject.projectId,
          level: 2,
        }, { transaction: t });
      }));

      await t.commit();
      return newProject;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async update(id: number, payload: UpdateProjectPayload, file?: Express.Multer.File): Promise<Project | null> {
    const project = await Project.findByPk(id);
    if (!project) {
      return null;
    }

    const dataToUpdate: { [key: string]: any } = { ...payload };

    if (file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        throw new Error('Cloudinary configuration is missing.');
      }
      dataToUpdate.imageUrl = await uploadImageToCloudinary(file.buffer);
    }

    await project.update(dataToUpdate);
    return project;
  }

  static async disable(id: number): Promise<Project | null> {
    const project = await Project.findByPk(id);
    if (!project) {
      return null;
    }
    await project.update({ enabled: false });
    return project;
  }
}
