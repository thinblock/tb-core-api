import { DataTypes } from 'sequelize';
export default {
  up: (queryInterface: any, Sequelize: DataTypes) => {
    return [
      queryInterface.addColumn(
        'tb_client_devices',
        'user_id',
        Sequelize.STRING(255),
        {
          allowNull: false
        }
      ),
    ];
  },
  down: (queryInterface: any) => {
    return [
      queryInterface.removeColumn(
        'tb_client_devices',
        'user_id'
      ),
    ];
  }
};