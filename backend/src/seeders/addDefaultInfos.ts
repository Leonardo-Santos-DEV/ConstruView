import User from '../models/User';
import Client from '../models/Client';
import bcrypt from 'bcrypt';

export default async function addDefaultInfos() {
  const [clientAdmin] = await Client.findOrCreate({
    where: {clientName: 'Cliente Admin'},
    defaults: {
      clientName: 'Cliente Admin',
    },
  });

  await User.findOrCreate({
    where: {email: 'admin@admin.com'},
    defaults: {
      clientId: clientAdmin.clientId,
      userName: 'Administrador',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin@2025', 10),
      isMasterAdmin: true,
      enabled: true,
    },
  });
}
