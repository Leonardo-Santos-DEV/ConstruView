import {Request, Response} from 'express';
import UserService from "../services/UserService";
import {UpdateUserPayload} from "../interfaces/UserInterfaces";

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
    const payload: UpdateUserPayload = req.body;

    if (payload.isClientAdmin !== undefined) {
      return res.status(403).json({ message: "Admin status cannot be changed through this endpoint. Use the client administration endpoint." });
    }

    const user = await UserService.update(Number(req.params.id), payload);
    if (!user) return res.status(404).json({error: 'User not found'});
    return res.json(user);
  }

  static async delete(req: Request, res: Response) {
    const user = await UserService.delete(Number(req.params.id));
    if (!user) return res.status(404).json({error: 'User not found'});
    return res.json({message: 'User deleted'});
  }
}
