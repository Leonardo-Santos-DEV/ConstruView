import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export default class ShareLink extends Model {
  public shareLinkId: number;
  public contentId: number;
  public token: string;
  public expiresAt: Date;
}

ShareLink.init(
  {
    shareLinkId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contentId: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, unique: true, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: 'shareLink' }
);