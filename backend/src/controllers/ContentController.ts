import { Request, Response } from 'express';
import ContentService from '../services/ContentService';

export default class ContentController {
  static async getAll(req: Request, res: Response) {
    return ContentService.getAll(req, res);
  }

  static async getById(req: Request, res: Response) {
    return ContentService.getById(req, res);
  }

  static async create(req: Request, res: Response) {
    return ContentService.create(req, res);
  }

  static async update(req: Request, res: Response) {
    return ContentService.update(req, res);
  }

  static async disable(req: Request, res: Response) {
    return ContentService.disable(req, res);
  }
}
