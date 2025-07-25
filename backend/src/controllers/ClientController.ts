import { Request, Response } from 'express';
import ClientService from "../services/ClientService";
import UserService from "../services/UserService";

export default class ClientController {
  static async getAll(_req: Request, res: Response) {
    try {
      const clients = await ClientService.getAll();
      return res.json(clients);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const client = await ClientService.getById(Number(req.params.id));
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      return res.json(client);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const client = await ClientService.create(req.body);
      return res.status(201).json(client);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const client = await ClientService.update(Number(req.params.id), req.body);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      return res.json(client);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async setClientAdmin(req: Request, res: Response) {
    if (!req.user?.isMasterAdmin) {
      return res.status(403).json({ message: 'Only Master Admins can set a Client Admin.' });
    }

    try {
      const { id } = req.params;
      const { userId: newAdminUserId } = req.body;

      if (!newAdminUserId) {
        return res.status(400).json({ message: 'User ID is required.' });
      }

      const updatedAdmin = await UserService.setClientAdmin(Number(id), newAdminUserId);
      return res.status(200).json(updatedAdmin);

    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  static async disable(req: Request, res: Response) {
    try {
      const client = await ClientService.disable(Number(req.params.id));
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      return res.status(200).json(client);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
