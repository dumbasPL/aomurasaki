import path from 'path';
import {Sequelize} from 'sequelize';
import {Umzug, SequelizeStorage} from 'umzug';
import logger from './logger';
import sequelize from './sequelize';

export const umzug = new Umzug({
  migrations: {
    glob: 'Migrations/*.{js,ts}',
    resolve: ({name, path: migrationFilePath, context}) => {
      const migration = require(migrationFilePath!);
      return {
        name: path.parse(name).name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({sequelize}),
  logger: logger,
});

export type Migration = typeof umzug._types.migration;

export async function migrateDatabase() {
  logger.debug('Starting database migration');

  const migrationsRan = await umzug.up();
  logger.info(`Executed ${migrationsRan.length} database migrations`);
}

if (require.main === module) {
  umzug.runAsCLI();
}
