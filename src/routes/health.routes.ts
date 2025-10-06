import { FastifyInstance } from 'fastify';

import { env } from '../config/env';

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        tags: ['System'],
        summary: 'Health Check',
        description: 'Verifica se a API está funcionando',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
              timestamp: { type: 'string', format: 'date-time' },
              uptime: { type: 'number' },
              database: { type: 'string', example: 'connected' },
            },
          },
        },
      },
    },
    async () => {
      try {
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
    },
  );
}
