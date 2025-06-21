import { Request, Response } from 'express';
import ContentService from '../services/ContentService';

export default class ContentController {
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

    try {
      const contents = await ContentService.getAll({ projectId, category });
      return res.json(contents);
    } catch (error) {
      console.error("Error in ContentController getAll:", error);
      return res.status(500).json({ error: "Failed to retrieve contents" });
    }
  }

  static async getById(req: Request, res: Response) {
    const contentId = parseInt(req.params.id, 10);
    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Content ID must be a valid number' });
    }
    try {
      const content = await ContentService.getById(contentId);
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      return res.json(content);
    } catch (error) {
      console.error(`Error in ContentController getById for ID ${contentId}:`, error);
      return res.status(500).json({ error: "Failed to retrieve content item" });
    }
  }

  static async create(req: Request, res: Response) {
    const { projectId, category, contentName, url } = req.body;
    const previewImageFile = req.file;

    if (!projectId || !category || !contentName || !url) {
      return res.status(400).json({ message: 'All fields are required: projectId, category, contentName, url.' });
    }

    try {
      const newContent = await ContentService.create({
        projectId: Number(projectId),
        category,
        contentName,
        url,
        previewImageFile
      });
      return res.status(201).json(newContent);
    } catch (error: any) {
      console.error("Error in ContentController create:", error.message);
      return res.status(500).json({ message: 'An internal error occurred while creating the content.' });
    }
  }

  static async update(req: Request, res: Response) {
    const contentId = parseInt(req.params.id, 10);
    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Content ID must be a valid number' });
    }
    try {
      const updated = await ContentService.update(contentId, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Content not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error(`Error in ContentController update for ID ${contentId}:`, error);
      return res.status(500).json({ error: "Failed to update content" });
    }
  }

  static async disable(req: Request, res: Response) {
    const contentId = parseInt(req.params.id, 10);
    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Content ID must be a valid number' });
    }
    try {
      const disabled = await ContentService.disable(contentId);
      if (!disabled) {
        return res.status(404).json({ error: 'Content not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error(`Error in ContentController disable for ID ${contentId}:`, error);
      return res.status(500).json({ error: "Failed to disable content" });
    }
  }
}
