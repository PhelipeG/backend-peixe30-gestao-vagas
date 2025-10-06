import { FastifyInstance } from 'fastify';

import { authRoutes } from './auth.routes';
import { candidateRoutes } from './candidate.routes';
import { healthRoutes } from './health.routes';
import { jobRoutes } from './job.routes';

export async function registerRoutes(app: FastifyInstance) {
  // Health check
  await app.register(healthRoutes);

  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(jobRoutes, { prefix: '/api/jobs' });
  await app.register(candidateRoutes, { prefix: '/api/candidates' });
}
