// NOVO CÓDIGO - COPIAR E COLAR
import { Request, Response } from 'express';
import ProjectService from "../services/ProjectService";
import { uploadImageToCloudinary } from "../helpers/uploadImageToCloudinary";
import { UpdateProjectPayload } from '../interfaces/ProjectInterfaces';

export default class ProjectController {
  static async getAll(req: Request, res: Response) {
    try {
      const projects = await ProjectService.getAll(req.user!);
      return res.status(200).json(projects);
    } catch (error: any) {
      return res.status(500).json({ message: "Failed to retrieve projects.", error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Project ID must be a number.' });
    }

    try {
      const project = await ProjectService.getById(projectId, req.user!);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json(project);
    } catch (error: any) {
      return res.status(500).json({ message: "Failed to retrieve project.", error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    const { projectName, clientId } = req.body;
    const imageFile = req.file;

    if (!projectName || !clientId) {
      return res.status(400).json({ message: 'Project name and client ID are required.' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary configuration is missing. Please check your environment variables.");
      return res.status(500).json({ message: 'Internal server error: Image upload service not configured.' });
    }

    try {
      let imageUrl = process.env.DEFAULT_IMAGE ?? 'https://res.cloudinary.com/dfpdfsuv3/image/upload/v1749297418/vr6d7yslybmfi4ctrbxt.png';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile.buffer);
      }

      const newProject = await ProjectService.create({
        projectName,
        clientId: Number(clientId),
        imageUrl,
      });

      return res.status(201).json(newProject);
    } catch (error: any) {
      console.error("Error in ProjectController create:", error.message);
      return res.status(500).json({ message: 'An internal error occurred while creating the project.' });
    }
  }

  static async update(req: Request, res: Response) {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Project ID must be a number.' });
    }

    const payload: UpdateProjectPayload = req.body;
    const imageFile = req.file;

    try {
      const updatedProject = await ProjectService.update(projectId, payload, imageFile);

      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json(updatedProject);
    } catch (error: any) {
      return res.status(500).json({ message: "Failed to update project.", error: error.message });
    }
  }

  static async disable(req: Request, res: Response) {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Project ID must be a number.' });
    }

    try {
      const disabledProject = await ProjectService.disable(projectId);
      if (!disabledProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: "Failed to disable project.", error: error.message });
    }
  }
}
