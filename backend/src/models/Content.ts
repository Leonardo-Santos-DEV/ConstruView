import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export default class Content extends Model {
  public contentId: number;
  public projectId: number;
  public category: string;
  public contentName: string;
  public url: string;
  public date!: Date;
  public enabled!: boolean;
}

Content.init(
  {
    contentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    contentName: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  { sequelize, modelName: 'content' });
