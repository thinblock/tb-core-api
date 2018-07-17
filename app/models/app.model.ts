import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const App = sequelize.define('tb_auth_apps', {
  name: Sequelize.STRING(255),
  client_id: Sequelize.STRING(255),
  client_secret: Sequelize.STRING(255), // Hashed secret
  scope: Sequelize.STRING(15),
  user_id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: 'tb_auth_users',
      key: 'id'
    }
  },
  refresh_token: Sequelize.STRING(255),
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default App;