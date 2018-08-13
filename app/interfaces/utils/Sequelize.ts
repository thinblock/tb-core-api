import { Model } from 'sequelize';

export interface IModel extends Model<{}, {}> {
  prototype: any;
}