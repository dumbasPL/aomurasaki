
import {Logger} from 'tslog';

const logger: Logger = new Logger({
  minLevel: 'debug',
});

logger.debug('Logger initialized');

export default logger;
