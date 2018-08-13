import * as fs from 'fs';
import { join } from 'path';
const tableNameArg = process.argv[2];

if (!tableNameArg) {
  console.log('Please specify table to create migration for!');
  process.exit(1);
}

const fileName = new Date().toISOString().replace(/[-:ZT.]/g, '_') + tableNameArg + '.ts';

const template = `
import { DataTypes } from 'sequelize';
export default {
  up: (queryInterface: any, Sequelize: DataTypes) => {
    return [
      queryInterface.addColumn(
        '${tableNameArg}',
        'test_col',
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
        '${tableNameArg}',
        'test_col'
      ),
    ];
  }
};
`;

fs.writeFileSync(join(__dirname, '../migrations', fileName), template);

console.log('Created new migration file: migrations/' + fileName);