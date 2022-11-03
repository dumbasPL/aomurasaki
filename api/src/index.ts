import 'reflect-metadata';
import 'dotenv/config';
import sequelize from './sequelize';
import logger from './logger';
import app from './app';
import {migrateDatabase} from './migrations';

const PORT = parseInt(process.env.PORT || '3000');

async function main() {
  logger.debug('Starting main');

  await sequelize.authenticate();
  logger.info(`Connected to database ${sequelize.getDatabaseName()} using ${sequelize.getDialect()} v${await sequelize.databaseVersion()}`);

  await migrateDatabase();

  logger.debug(`Starting express server on port ${PORT}`);
  app.listen(PORT, '0.0.0.0', () => logger.info(`Server listening on http://0.0.0.0:${PORT}`));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
