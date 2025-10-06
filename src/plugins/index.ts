import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';

import { env } from '../config/env';
import { errorHandler } from '../middleware/error.middleware';
import { registerRateLimit } from './rate-limit';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
    };
    user: {
      sub: string;
      email: string;
    };
  }
}

export async function registerPlugins(app: FastifyInstance) {
  // Plugin de Rate Limit
  await registerRateLimit(app);

  // Plugin de CORS
  await app.register(cors, {
    origin:
      env.NODE_ENV === 'production'
        ? ['https://peixe30-sistemas-vagas.vercel.app','http://localhost:3000']
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Plugin de JWT
  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Plugin de Error Handler Global
  app.setErrorHandler(errorHandler);
}
