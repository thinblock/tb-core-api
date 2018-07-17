import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const Account = sequelize.define('tb_eth_accounts', {
  address: {
    type: Sequelize.STRING(255),
    unique: true,
    allowNull: false,
  },
  key: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  client_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Account;