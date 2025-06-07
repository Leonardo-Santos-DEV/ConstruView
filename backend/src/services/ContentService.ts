import { Request, Response } from 'express';
import Content from '../models/Content';
import Project from "../models/Project";
import {uploadImageToCloudinary} from "../helpers/uploadImageToCloudinary";

export default class ContentService {
  static async getAll(req: Request, res: Response) {
    const projectIdString = req.query.projectId as string;
    const category = req.query.category as string;

    if (!projectIdString) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const projectId = parseInt(projectIdString, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Project ID must be a number' });
    }

    const whereClause: any = {
      projectId,
      enabled: true
    };

    if (category) {
      whereClause.category = category;
    }

    try {
      const contents = await Content.findAll({
        where: whereClause,
        include: [{ model: Project, as: 'project' }],
        order: [
          ['createdAt', 'DESC']
        ]
      });

      return res.json(contents);

    } catch (error) {
      console.error("Error fetching all contents:", error);
      return res.status(500).json({ error: "Failed to retrieve contents" });
    }
  }

  static async getById(req: Request, res: Response) {
    const contentIdString = req.params.id;
    const contentId = parseInt(contentIdString, 10);

    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Content ID must be a valid number' });
    }

    try {
      const content = await Content.findByPk(contentId, { include: [{ model: Project, as: 'project' }] });
      return res.json(content);

    } catch (error) {
      console.error(`Error fetching content by ID ${contentId}:`, error);
      return res.status(500).json({ error: "Failed to retrieve content item" });
    }
  }

  static async create(req: Request, res: Response) {
    const { projectId, category, contentName, url } = req.body;
    const previewImageFile = req.file;

    if (!projectId || !category || !contentName || !url) {
      return res.status(400).json({ message: 'All fields are required: projectId, category, contentName, url.' });
    }
    if (!process.env.IMGUR_CLIENT_ID) {
      console.error("IMGUR_CLIENT_ID not set in server environment variables.");
      return res.status(500).json({ message: 'Image upload service is not configured.' });
    }

    try {
      let previewImageUrl = process.env.DEFAULT_IMAGE ?? 'https://res.cloudinary.com/dfpdfsuv3/image/upload/v1749297418/vr6d7yslybmfi4ctrbxt.png';


      if (previewImageFile) {
        previewImageUrl = await uploadImageToCloudinary(previewImageFile.buffer);
      }

      const contentData = {
        projectId: Number(projectId),
        category,
        contentName,
        url,
        previewImageUrl,
        enabled: true,
      };

      const newContentInstance = await Content.create(contentData);

      const project = await Project.findByPk(newContentInstance.projectId);

      const responseData = newContentInstance.get({ plain: true }) as Content & { project: Project };
      if (project) {
        responseData.project = project.get({ plain: true });
      }

      return res.status(201).json(responseData);

    } catch (error: any) {
      console.error("Error during content creation process:", error.response?.data || error.message);
      return res.status(500).json({ message: 'An internal error occurred while creating the content.' });
    }
  }

  static async update(req: Request, res: Response) {
    const contentIdString = req.params.id;
    const contentId = parseInt(contentIdString, 10);

    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Content ID must be a valid number' });
    }

    try {
      const content = await Content.findByPk(contentId);
      if (!content) return res.status(404).json({error: 'Content not found'});

      await content.update(req.body);
      return res.status(204).send();
    } catch (error) {
      console.error(`Error updating content ${contentId}:`, error);
      return res.status(500).json({ error: "Failed to update content" });
    }
  }

  static async disable(req: Request, res: Response) {
    const contentIdString = req.params.id;
    const contentId = parseInt(contentIdString, 10);

    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Content ID must be a valid number' });
    }

    try {
      const content = await Content.findByPk(contentId);
      if (!content) return res.status(404).json({error: 'Content not found'});

      await content.update({enabled: false});
      return res.status(204).send();
    } catch (error) {
      console.error(`Error disabling content ${contentId}:`, error);
      return res.status(500).json({ error: "Failed to disable content" });
    }
  }
}
