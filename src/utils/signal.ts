import { logger } from './logger';

export type SignalHandlerFn = (name: string) => void | Promise<void>;

class SignalHandler {
  protected handlers: SignalHandlerFn[] = [];

  protected terminating = false;

  add(handler: SignalHandlerFn) {
    this.handlers.push(handler);
  }

  remove(handler: SignalHandlerFn) {
    this.handlers = this.handlers.filter((h) => (h !== handler));
  }

  async exec(signal: string, code: number) {
    if (this.terminating) {
      logger.info(`Received signal "${signal}", gracefull shutdown sequence already running.`);
      return;
    }
    this.terminating = true;
    logger.info(`Received signal "${signal}", initiating gracefull shutdown sequence.`);
    for (let i = 0; i < this.handlers.length; i += 1) {
      await this.handlers[i](signal); // eslint-disable-line no-await-in-loop
    }
    logger.info(`Exiting with code ${code}.`);
    process.exit(code);
  }
}

export const signalHandler = new SignalHandler();

process.on('SIGINT', () => { signalHandler.exec('SIGINT', 127); });
process.on('SIGTERM', () => { signalHandler.exec('SIGTERM', 127); });
