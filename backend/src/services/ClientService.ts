import Client from '../models/Client';

export default class ClientService {
  static async getAll() {
    return Client.findAll();
  }

  static async getById(id: number) {
    return Client.findByPk(id);
  }

  static async create(data: any) {
    return Client.create(data);
  }

  static async update(id: number, data: any) {
    const client = await Client.findByPk(id);
    if (!client) return null;
    await client.update(data);
    return client;
  }

  static async disable(id: number) {
    const client = await Client.findByPk(id);
    if (!client) return null;
    await client.update({enabled: false});
    return client;
  }
}
