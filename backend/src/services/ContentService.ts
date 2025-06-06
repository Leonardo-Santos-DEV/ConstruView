import { Request, Response } from 'express';
import Content from '../models/Content';
import Project from "../models/Project";
import axios from "axios";
import FormData from "form-data";

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
    // 1. O multer já separou o arquivo (req.file) dos campos de texto (req.body)
    const { projectId, category, contentName, url } = req.body;
    const previewImageFile = req.file;

    // Validação dos dados recebidos
    if (!previewImageFile) {
      return res.status(400).json({ message: 'Preview image is required.' });
    }
    if (!projectId || !category || !contentName || !url) {
      return res.status(400).json({ message: 'All fields are required: projectId, category, contentName, url.' });
    }
    if (!process.env.IMGUR_CLIENT_ID) {
      console.error("IMGUR_CLIENT_ID not set in server environment variables.");
      return res.status(500).json({ message: 'Image upload service is not configured.' });
    }

    try {
      const formData = new FormData();
      formData.append('image', previewImageFile.buffer);

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
        throw new Error('Failed to upload preview image to hosting service.');
      }

      const previewImageUrl = imgurResponse.data.data.link;

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
