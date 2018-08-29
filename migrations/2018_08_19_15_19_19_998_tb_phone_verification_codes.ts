import { DataTypes } from 'sequelize';
export default {
  up: (queryInterface: any, Sequelize: DataTypes) => {
    return [
      queryInterface.addColumn(
        'tb_phone_verification_codes',
        'user_id',
        Sequelize.INTEGER(),
        {
          allowNull: false
        }
      ),
    ];
  },
  down: (queryInterface: any) => {
    return [
      queryInterface.removeColumn(
        'tb_phone_verification_codes',
        'user_id'
      ),
    ];
  }
};
