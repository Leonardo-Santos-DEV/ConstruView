import { Request, Response } from 'express';
import ClientService from "../services/ClientService";

export default class ClientController {
  static async getAll(req: Request, res: Response) {
    const clients = await ClientService.getAll();
    return res.json(clients);
  }

  static async getById(req: Request, res: Response) {
    const client = await ClientService.getById(Number(req.params.id));
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.json(client);
  }

  static async create(req: Request, res: Response) {
    const client = await ClientService.create(req.body);
    return res.status(201).json(client);
  }

  static async update(req: Request, res: Response) {
    const client = await ClientService.update(Number(req.params.id), req.body);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.json(client);
  }

  static async disable(req: Request, res: Response) {
    const client = await ClientService.disable(Number(req.params.id));
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.json({ message: 'Client deleted' });
  }
}
