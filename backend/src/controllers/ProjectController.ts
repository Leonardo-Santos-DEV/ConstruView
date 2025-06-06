import { Request, Response } from 'express';
import ProjectService from "../services/ProjectService";

export default class ProjectController {
  static async getAll(req: Request, res: Response) {
    return await ProjectService.getAll(req, res);
  }

  static async getById(req: Request, res: Response) {
    return await ProjectService.getById(req, res);
  }

  static async create(req: Request, res: Response) {
    return await ProjectService.create(req, res);
  }

  static async update(req: Request, res: Response) {
    return await ProjectService.update(req, res);
  }

  static async disable(req: Request, res: Response) {
    return await ProjectService.disable(req, res);
  }
}
