import { FastifyInstance } from 'fastify';

import { JobController } from '../controllers/job.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const jobController = new JobController();

export async function jobRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware); // rotas protegidas(all)

  app.post('/create', jobController.create.bind(jobController));
  app.get('/all', jobController.list.bind(jobController));
  app.get('/:id', jobController.getById.bind(jobController));
  app.put('/updateJob/:id', jobController.update.bind(jobController));
  app.delete('/deleteJob/:id', jobController.delete.bind(jobController));
}
