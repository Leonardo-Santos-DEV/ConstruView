// CÓDIGO ATUALIZADO - COPIAR E COLAR
import { Request, Response } from 'express';
import ClientService from "../services/ClientService";

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

  static async disable(req: Request, res: Response) {
    try {
      const client = await ClientService.disable(Number(req.params.id));
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      // Alterado de 204 para 200 para retornar o objeto atualizado
      return res.status(200).json(client);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
