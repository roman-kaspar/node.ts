import { randInt } from './rand';
import { sum } from './sum';
import { version } from './version';

import { logger } from './utils/logger';
import { signalHandler, SignalHandlerFn } from './utils/signal';
import { delay } from './utils/time';

const asyncSignalHandler: SignalHandlerFn = async () => {
  logger.info('Shutdown handler, asynchronous (10s).');
  await delay(10000);
};
signalHandler.add(asyncSignalHandler);

const main = async () => {
  try {
    const a = randInt(100);
    const b = randInt(200);

    const c = sum(a, b);

    logger.info('Started!');
    logger.debug(`${a} + ${b} = ${c}`);
    logger.error(`(version ${version})`);

    while (true) { // eslint-disable-line no-constant-condition
      await delay(5 * 60 * 1000); // eslint-disable-line no-await-in-loop
      const level = (Math.random() < 0.1) ? 'error' : 'info';
      logger[level]('still alive');
    }
  } catch (e) {
    logger.error(e.message);
    logger.error('Terminating!');
    process.exit(1);
  }
};
main();
