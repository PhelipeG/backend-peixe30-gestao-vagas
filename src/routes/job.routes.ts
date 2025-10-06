import { FastifyInstance } from 'fastify';

import { JobController } from '../controllers/job.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { jobSchema, errorSchema, paginationSchema } from '../schemas';

const jobController = new JobController();

export async function jobRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware); // rotas protegidas(all)
  // Criar nova vaga
  app.post('/create', {
    schema: {
      tags: ['Jobs'],
      summary: 'Criar nova vaga',
      description: 'Cria uma nova vaga de emprego no sistema',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'description', 'location', 'salaryRange', 'skills'],
        properties: {
          title: { 
            type: 'string',
            description: 'Título da vaga'
          },
          description: { 
            type: 'string',
            description: 'Descrição detalhada da vaga'
          },
          location: { 
            type: 'string',
            description: 'Localização da vaga'
          },
          salaryRange: { 
            type: 'string',
            description: 'Faixa salarial oferecida'
          },
          skills: {
            type: 'array',
            items: { type: 'string' },
            description: 'Lista de habilidades necessárias'
          }
        }
      },
      response: {
        201: jobSchema,
        400: errorSchema,
        401: errorSchema,
        500: errorSchema
      }
    }
  }, jobController.create.bind(jobController));

  // Listar todas as vagas
 app.get('/all', {
  schema: {
    tags: ['Jobs'],
    summary: 'Listar todas as vagas',
    security: [{ bearerAuth: [] }],
     querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
      }
    },
  },
  
}, jobController.list.bind(jobController));

  // Buscar vaga por ID
  app.get('/:id', {
    schema: {
      tags: ['Jobs'],
      summary: 'Buscar vaga por ID',
      description: 'Retorna os detalhes de uma vaga específica',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { 
            type: 'string',
            description: 'ID único da vaga'
          }
        }
      },
      response: {
        200: jobSchema,
        404: errorSchema,
        401: errorSchema,
        500: errorSchema
      }
    }
  }, jobController.getById.bind(jobController));

  // Atualizar vaga
  app.put('/updateJob/:id', {
    schema: {
      tags: ['Jobs'],
      summary: 'Atualizar vaga',
      description: 'Atualiza os dados de uma vaga existente',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { 
            type: 'string',
            description: 'ID único da vaga a ser atualizada'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: { 
            type: 'string',
            description: 'Novo título da vaga'
          },
          description: { 
            type: 'string',
            description: 'Nova descrição da vaga'
          },
          location: { 
            type: 'string',
            description: 'Nova localização da vaga'
          },
          salaryRange: { 
            type: 'string',
            description: 'Nova faixa salarial'
          },
          skills: {
            type: 'array',
            items: { type: 'string' },
            description: 'Nova lista de habilidades necessárias'
          }
        }
      },
      response: {
        200: jobSchema,
        404: errorSchema,
        400: errorSchema,
        401: errorSchema,
        500: errorSchema
      }
    }
  }, jobController.update.bind(jobController));

  // Deletar vaga
  app.delete('/deleteJob/:id', {
    schema: {
      tags: ['Jobs'],
      summary: 'Deletar vaga',
      description: 'Remove uma vaga do sistema permanentemente',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { 
            type: 'string',
            description: 'ID único da vaga a ser deletada'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { 
              type: 'string',
              description: 'Mensagem de confirmação da exclusão'
            }
          }
        },
        404: errorSchema,
        401: errorSchema,
        500: errorSchema
      }
    }
  }, jobController.delete.bind(jobController));
}
