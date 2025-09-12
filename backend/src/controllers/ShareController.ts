import { Request, Response } from 'express';
import ShareLink from '../models/ShareLink';
import Content from '../models/Content';
import Project from '../models/Project';
import crypto from 'crypto';

export default class ShareController {
  static async create(req: Request, res: Response) {
    const { contentId, expiresIn } = req.body;

    if (!contentId || !expiresIn) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      const newShareLink = await ShareLink.create({
        contentId,
        token,
        expiresAt,
      });

      const shareableLink = `${process.env.FRONTEND_HOST}/share/${token}`;

      return res.status(201).json({ shareableLink });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'An internal error occurred' });
    }
  }

  static async view(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const shareLink = await ShareLink.findOne({
        where: { token },
        include: [{
          model: Content,
          as: 'content',
          include: [{
            model: Project,
            as: 'project',
          }],
        }],
      });

      if (!shareLink || shareLink.expiresAt < new Date()) {
        return res.status(404).json({ error: 'Link not found or expired' });
      }

      return res.json((shareLink as any).content);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'An internal error occurred' });
    }
  }
}