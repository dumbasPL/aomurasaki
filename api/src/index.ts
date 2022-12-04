import 'reflect-metadata';
import {PORT} from './env';
import sequelize from './sequelize';
import logger from './logger';
import app from './app';
import {migrateDatabase} from './migrations';
import {initMapper} from './mapper';
import {container} from 'tsyringe';
import UserService from './Services/UserService';
import {loadI18n} from './i18n';

async function main() {
  logger.debug('Starting main');

  await loadI18n();

  await sequelize.authenticate();
  logger.info(`Connected to database ${sequelize.getDatabaseName()} using ${sequelize.getDialect()} v${await sequelize.databaseVersion()}`);

  await migrateDatabase();

  initMapper();

  await container.resolve(UserService).createInitialUser();

  logger.debug(`Starting express server on port ${PORT}`);
  app.listen(PORT, () => logger.info(`Server listening on http://localhost:${PORT}`));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
