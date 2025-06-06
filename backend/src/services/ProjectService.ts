import {Request, Response} from 'express';
import Project from "../models/Project";
import axios from "axios";
import FormData from 'form-data';
import Permission from "../models/Permission";
import User from "../models/User";

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
    if (projectId) {
      const project = await Project.findByPk(+projectId);
      if (!project) return res.status(404).json({error: 'Project not found'});
      return res.status(200).json(project);
    } else {
      return res.status(400).json({error: 'Project ID is required'});
    }
  }

  static async create(req: Request, res: Response) {
    const { projectName, clientId } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: 'Project image is required.' });
    }
    if (!projectName || !clientId) {
      return res.status(400).json({ message: 'Project name and client ID are required.' });
    }
    if (!process.env.IMGUR_CLIENT_ID) {
      console.error("IMGUR_CLIENT_ID not set in server environment variables.");
      return res.status(500).json({ message: 'Image upload service is not configured.' });
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile.buffer);

      const imgurResponse = await axios.post(
        'https://api.imgur.com/3/image',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
        }
      );

      if (!imgurResponse.data.success) {
        throw new Error('Failed to upload image to hosting service.');
      }

      const imageUrl = imgurResponse.data.data.link;

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
      return res.status(500).json({ message: 'An internal error occurred while creating the project.' });
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
