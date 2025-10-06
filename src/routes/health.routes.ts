import { FastifyInstance } from 'fastify';

import { env } from '../config/env';
import { prisma } from '../utils/prisma';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    try {
      // Teste de conexão com banco
      // await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
        database: 'connected',
        version: '1.0.0',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
        database: 'disconnected',
        version: '1.0.0',
      };
    }
  });
}
