import { createLogger, format, transports } from 'winston';
import Transport from 'winston-transport';
import 'winston-daily-rotate-file';

import { config } from './config';
import { timestamp } from './time';

const myTransports: Transport[] = [new transports.Console({ silent: true })];
const { combine, colorize, printf } = format;

const formatConsole = printf(({ level, message }) => `${timestamp()} ${level.padStart(15, ' ')}: ${message}`);
const formatFile = printf(({ level, message }) => `${timestamp()} ${level.toUpperCase().padStart(5, ' ')}: ${message}`);

if (config.get('app:logs')) {
  const dir = config.get('app:logs:dir');
  const rotate = config.get('app:logs:rotate');
  const options = {
    format: formatFile,
    level: (config.get('NODE_ENV') === 'development') ? 'debug' : 'info',
    filename: (rotate ? 'all-%DATE%' : `all-${timestamp().replace(' ', 'T')}`),
    dirname: dir,
    maxFiles: rotate,
    extension: '.log',
  };
  myTransports.push(new (rotate ? transports.DailyRotateFile : transports.File)(options));
  options.level = 'error';
  options.filename = (rotate ? 'errors-%DATE%' : `errors-${timestamp().replace(' ', 'T')}`);
  myTransports.push(new (rotate ? transports.DailyRotateFile : transports.File)(options));
}

if (config.get('NODE_ENV') === 'development') {
  myTransports.push(new transports.Console({
    format: combine(colorize(), formatConsole),
    level: 'debug',
  }));
}

export const logger = createLogger({
  transports: myTransports,
});
