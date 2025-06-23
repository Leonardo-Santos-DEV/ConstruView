import Project from "../models/Project";
import Permission from "../models/Permission";
import User from "../models/User";
import sequelize from '../config/database';
import {CreateProjectPayload, UpdateProjectPayload} from '../interfaces/ProjectInterfaces';
import {loginResponse as AuthenticatedUser} from '../interfaces/AuthInterfaces';
import {uploadImageToCloudinary} from "../helpers/uploadImageToCloudinary";

export default class ProjectService {

  static async getAll(user: AuthenticatedUser): Promise<Project[]> {
    if (user.isMasterAdmin) {
      return Project.findAll({ where: { enabled: true } });
    } else {
      return Project.findAll({ where: { clientId: user.clientId, enabled: true } });
    }
  }

  static async getById(projectId: number, user: AuthenticatedUser): Promise<Project | null> {
    const whereClause: any = {
      projectId: projectId,
      enabled: true
    };

    if (!user.isMasterAdmin) {
      whereClause.clientId = user.clientId;
    }

    return Project.findOne({ where: whereClause });
  }

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
