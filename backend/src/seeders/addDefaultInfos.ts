import User from '../models/User';
import Client from '../models/Client';
import Project from '../models/Project';
import Content from '../models/Content';
import Permission from '../models/Permission';
import bcrypt from 'bcrypt';

export default async function addDefaultInfos() {
  const [clientAdmin] = await Client.findOrCreate({
    where: {clientName: 'Cliente Admin'},
    defaults: {
      clientName: 'Cliente Admin',
    },
  });

  await User.findOrCreate({
    where: {email: 'admin@example.com'},
    defaults: {
      clientId: clientAdmin.clientId,
      userName: 'Administrador',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      isMasterAdmin: true,
      enabled: true,
    },
  });

  const [client] = await Client.findOrCreate({
    where: {clientName: 'Cliente 01'},
    defaults: {
      clientName: 'Cliente 01',
    },
  });

  const [user] = await User.findOrCreate({
    where: {email: 'user@example.com'},
    defaults: {
      clientId: client.clientId,
      userName: 'Usuário 01',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      isMasterAdmin: false,
      enabled: true,
    },
  });

  const [project] = await Project.findOrCreate({
    where: {
      projectName: 'Obra 01',
      clientId: client.clientId,
    },
    defaults: {
      projectName: 'Obra 01',
      imageUrl: 'https://picsum.photos/seed/projectA/400/300',
      clientId: client.clientId,
      enabled: true,
    },
  });

  await Permission.findOrCreate({
    where: {
      userId: user.userId,
      projectId: project.projectId,
    },
    defaults: {
      userId: user.userId,
      projectId: project.projectId,
      level: 2,
    },
  });

  await Content.findOrCreate({
    where: {
      contentName: 'First View',
      projectId: project.projectId,
      category: '360view',
    },
    defaults: {
      contentName: 'First View',
      url: 'https://my.matterport.com/show/?m=gsX73h71xu7',
      category: '360view',
      previewImageUrl: 'https://picsum.photos/seed/360view/400/300',
      projectId: project.projectId,
      enabled: true,
    },
  });

}
