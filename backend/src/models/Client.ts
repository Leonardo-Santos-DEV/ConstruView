import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export default class Client extends Model {
  public clientId: number;
  public clientName: string;
  public enabled!: boolean;
}

Client.init(
  {
    clientId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clientName: { type: DataTypes.STRING, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  { sequelize, modelName: 'client' });
