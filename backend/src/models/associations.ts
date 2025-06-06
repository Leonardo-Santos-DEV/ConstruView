import User from "./User";
import Client from "./Client";
import Permission from "./Permission";
import Project from "./Project";
import Content from "./Content";

export function setupAssociations() {
  Client.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
  Project.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

  Client.hasMany(User, { foreignKey: 'clientId', as: 'users' });
  User.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

  User.hasMany(Permission, { foreignKey: 'userId', as: 'permissions' });
  Permission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  Project.hasMany(Permission, { foreignKey: 'projectId', as: 'project' });
  Permission.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  Project.hasMany(Content, { foreignKey: 'projectId', as: 'contents' });
  Content.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
}
