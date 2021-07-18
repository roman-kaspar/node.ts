import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

export const routes = router.routes();

router.get('/', (ctx: Koa.Context): void => {
  ctx.body = { ok: true };
});
