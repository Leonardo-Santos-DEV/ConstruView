import {Request, Response} from 'express';
import Project from "../models/Project";
import Permission from "../models/Permission";
import User from "../models/User";
import {uploadImageToCloudinary} from "../helpers/uploadImageToCloudinary";

export default class ProjectService {

  static async getAll(req: Request, res: Response) {
    const {user} = req;
    let projects: Project[];
    if (user.isMasterAdmin) {
      projects = await Project.findAll();
    } else {
      projects = await Project.findAll({where: {clientId: user.clientId, enabled: true}});
    }
    return res.status(200).json(projects);
  }

  static async getById(req: Request, res: Response) {
    const {params: {projectId}} = req;
    const {user} = req;
    if (projectId) {
      const project = await Project.findOne({where: {projectId: +projectId, clientId: user.clientId, enabled: true}});
      if (!project) return res.status(404).json({error: 'Project not found'});
      return res.status(200).json(project);
    } else {
      return res.status(400).json({error: 'Project ID is required'});
    }
  }

  static async create(req: Request, res: Response) {
    const {projectName, clientId} = req.body;
    const imageFile = req.file;

    if (!projectName || !clientId) {
      return res.status(400).json({message: 'Project name and client ID are required.'});
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary configuration is missing. Please check your environment variables.");
      return res.status(500).json({message: 'Internal server error. Cloudinary configuration is missing.'});
    }

    try {
      let imageUrl = process.env.DEFAULT_IMAGE ?? 'https://res.cloudinary.com/dfpdfsuv3/image/upload/v1749297418/vr6d7yslybmfi4ctrbxt.png';

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile.buffer);
      }

      const projectData = {
        projectName,
        clientId: Number(clientId),
        imageUrl: imageUrl,
        enabled: true,
      };

      const newProject = await Project.create(projectData);

      const users: User[] = await User.findAll({where: {clientId}});

      await Promise.all(users.map((user: User) => {
        return Permission.create({
          userId: user.userId,
          projectId: newProject.projectId,
          level: 2,
        })
      }))

      return res.status(201).json(newProject);

    } catch (error: any) {
      console.error("Error during project creation process:", error.response?.data || error.message);
      return res.status(500).json({message: 'An internal error occurred while creating the project.'});
    }
  }

  static async update(req: Request, res: Response) {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({error: 'Not found'});
    await project.update(req.body);
    return res.status(204);
  }

  static async disable(req: Request, res: Response) {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({error: 'Not found'});
    await project.update({enabled: false});
    return res.status(204);
  }
}
