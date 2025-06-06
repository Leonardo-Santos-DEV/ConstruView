import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export default class Project extends Model {
  public projectId: number;
  public projectName: string;
  public imageUrl: string;
  public clientId: number;
  public enabled: boolean;
}

Project.init(
  {
    projectId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    projectName: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  { sequelize, modelName: 'project' });
