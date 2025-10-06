import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

export async function registerRateLimit(app: FastifyInstance) {
  const RATE_LIMIT = 100;

  await app.register(rateLimit, {
    max: RATE_LIMIT, // 100 requisições
    timeWindow: '1 minute', // por minuto
    errorResponseBuilder: function () {
      return {
        error: true,
        message: 'Muitas requisições. Tente novamente em 1 minuto.',
        statusCode: 429,
      };
    },
  });
}
