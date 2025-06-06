import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export default class Permission extends Model {
  public permissionId: number;
  public userId: number;
  public projectId: number;
  public level: number;
}

Permission.init({
  permissionId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { sequelize, modelName: 'permission' });
