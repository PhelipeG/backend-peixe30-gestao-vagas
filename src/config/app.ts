import fastify from 'fastify';

import { env } from './env';

export function createApp() {
  const app = fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
  });

  return app;
}
