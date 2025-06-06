import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export default class User extends Model {
  public userId: number;
  public clientId: number;
  public userName: string;
  public email: string;
  public password: string;
  public isMasterAdmin: boolean;
  public enabled: boolean;
}

User.init({
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    userName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isMasterAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }},
    { sequelize, modelName: 'user' });
