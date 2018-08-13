
import { DataTypes } from 'sequelize';
export default {
  up: (queryInterface: any, Sequelize: DataTypes) => {
    return [
      queryInterface.addColumn(
        'tb_auth_users',
        'reset_password_token',
        Sequelize.STRING(255),
        {
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'tb_auth_users',
        'reset_password_attempts',
        Sequelize.INTEGER(11),
        {
          allowNull: false,
          defaultValue: 0
        }
      ),
      queryInterface.addColumn(
        'tb_auth_users',
        'status',
        Sequelize.ENUM(['active', 'inactive', 'suspended']),
        {
          allowNull: false
        }
      )
    ];
  },
  down: (queryInterface: any) => {
    return [
      queryInterface.removeColumn(
        'tb_auth_users',
        'reset_password_token'
      ),
      queryInterface.removeColumn(
        'tb_auth_users',
        'reset_password_attempts'
      ),
      queryInterface.removeColumn(
        'tb_auth_users',
        'status'
      ),
    ];
  }
};
