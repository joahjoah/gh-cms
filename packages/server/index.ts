import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { getAccessToken } from './github';
const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());

router.get('/', async (ctx) => {
  // Path params
  const code = ctx.query.code;

  if (!code || typeof code !== 'string') {
    ctx.throw(400, 'Missing code');
    return;
  }

  const res = await getAccessToken(code)
  if (res.error) {
    ctx.throw(400, res.errorDescription || res.error);
    return;
  }

  ctx.body = {
    ...res
  };
});

router.post('/post-endpoint', async (ctx: Router.RouterContext) => {
  const body = ctx.request.body as  {
    code?: string;
    // add other expected properties here
  };
  if (!body || !body.code ) {
    ctx.throw(400, 'Missing code');
    return;
  }

  const token = await getAccessToken(body.code)
  ctx.body = {
    token
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});