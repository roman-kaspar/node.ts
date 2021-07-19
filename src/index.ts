import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import noCache from 'koa-no-cache';

import { routes } from './routes';

import { config } from './utils/config';
import { HttpError, formatError } from './utils/error';
import { logger } from './utils/logger';
import { signalHandler, SignalHandlerFn } from './utils/signal';

import { version } from './version';

const asyncSignalHandler: SignalHandlerFn = () => {
  logger.info('Graceful shutdown completed, thanks for flying with us!');
};
signalHandler.add(asyncSignalHandler);

const appName = config.get('app:name');
const runMode = config.get('NODE_ENV') || 'unknown';
logger.info(`API server ${appName ? `"${appName}" ` : ''}(version ${version}) starting in ${runMode} mode...`);

const server = new Koa();
// logging + time measuring
server.use(async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const startMs = Date.now();
  logger.info(`--> ${ctx.method} ${ctx.url}`);
  logger.debug(`*** request headers: ${JSON.stringify(ctx.request.header, null, 4)}`);
  await next();
  if (ctx.body) {
    const data = ctx.response.header['content-encoding'] === 'gzip'
      ? '< ... gzip ... >'
      : JSON.stringify(ctx.body, null, 4);
    logger.debug(`*** response body: ${data}`);
  }
  logger.debug(`*** response headers: ${JSON.stringify(ctx.response.header, null, 4)}`);
  logger.info(`<-- ${ctx.status} in ${Date.now() - startMs}ms`);
});
// error handler
server.use(async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  try {
    await next();
  } catch (e) {
    logger.error(formatError(e));
    ctx.status = e.status || 500;
    ctx.body = {
      ok: false,
      error: `${e.name ? `[${e.name}] ` : ''}${e.message}`,
    };
  }
});
// no-cache
server.use(noCache({ global: true }));
// API token verification
const accessTokenHeader = config.get('app:token:header');
const accessTokenValue = config.get('app:token:value');
server.use(async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  if (accessTokenHeader && accessTokenValue && (ctx.request.header[accessTokenHeader] !== accessTokenValue)) {
    throw new HttpError('Unauthorized', 401);
  }
  await next();
});
// consistent 404
server.use(async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  await next();
  if (ctx.status === 404) {
    throw new HttpError('Not Found', 404);
  }
});
// gzip compression
server.use(compress());
// body parser
server.use(bodyParser());
// routes
server.use(routes);

// global error handling
server.on('error', (err) => {
  logger.error(formatError(err));
});

const port = config.get('app:port') || 3000;
server.listen(port, () => {
  logger.info(`Server ready, listening on port ${port}`);
});
