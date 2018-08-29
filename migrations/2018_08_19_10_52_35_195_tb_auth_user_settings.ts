import { DataTypes } from 'sequelize';
export default {
  up: (queryInterface: any, Sequelize: DataTypes) => {
    return [
      queryInterface.addColumn(
        'tb_auth_user_settings',
        'phone',
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
        'tb_auth_user_settings',
        'phone'
      ),
    ];
  }
};
