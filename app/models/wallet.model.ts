import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';
import WalletAddress from './wallet_address.model';
import WalletUser from './wallet_user.model';

const Wallet = sequelize.define('tb_wallets_wallets', {
  client_id: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  user_id: {
    type: Sequelize.STRING(11),
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

Wallet.hasMany(WalletAddress, { foreignKey: 'wallet_id', as: 'addresses' });
Wallet.hasMany(WalletUser, { foreignKey: 'wallet_id', as: 'users' });

export default Wallet;
