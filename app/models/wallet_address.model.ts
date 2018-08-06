import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const WalletAddress = sequelize.define('tb_wallets_addresses', {
  wallet_id: {
    type: Sequelize.INTEGER(11),
    references: {
      model: 'tb_wallets',
      key: 'id'
    }
  },
  chain: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  address: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default WalletAddress;
