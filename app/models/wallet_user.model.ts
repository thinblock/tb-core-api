import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const WalletAddress = sequelize.define('tb_wallets_users', {
  user_id: {
    type: Sequelize.STRING(11),
    allowNull: false
  },
  wallet_id: {
    type: Sequelize.INTEGER(11),
    references: {
      model: 'tb_wallets',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default WalletAddress;
