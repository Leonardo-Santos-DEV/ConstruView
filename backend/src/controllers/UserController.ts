import {Request, Response} from 'express';
import UserService from "../services/UserService";

export default class UserController {
  static async getAll(req: Request, res: Response) {
    const users = await UserService.getAll(Number(req.query.clientId));
    return res.json(users);
  }

  static async getById(req: Request, res: Response) {
    const user = await UserService.getById(Number(req.params.id));
    if (!user) return res.status(404).json({error: 'User not found'});
    return res.json(user);
  }

  static async create(req: Request, res: Response) {
    const user = await UserService.create(req.body);
    return res.status(201).json(user);
  }

  static async update(req: Request, res: Response) {
    const user = await UserService.update(Number(req.params.id), req.body);
    if (!user) return res.status(404).json({error: 'User not found'});
    return res.json(user);
  }

  static async delete(req: Request, res: Response) {
    const user = await UserService.delete(Number(req.params.id));
    if (!user) return res.status(404).json({error: 'User not found'});
    return res.json({message: 'User deleted'});
  }
}
