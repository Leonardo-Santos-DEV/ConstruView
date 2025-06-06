import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export default class Content extends Model {
  public contentId: number;
  public projectId: number;
  public category: string;
  public contentName: string;
  public url: string;
  previewImageUrl: string;
  public enabled!: boolean;
}

Content.init(
  {
    contentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    contentName: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    previewImageUrl: { type: DataTypes.STRING, allowNull: true },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  { sequelize, modelName: 'content' });
