import { FastifyInstance } from 'fastify';

import { CandidateController } from '../controllers/candidate.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { candidateSchema, errorSchema } from '../schemas';

const candidateController = new CandidateController();

export async function candidateRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware); // rotas protegidas(all)
  // Listar todos os candidatos
  app.get('/all', {
    schema: {
      tags: ['Candidates'],
      summary: 'Listar todos os candidatos',
      description: 'Retorna uma lista com todos os candidatos cadastrados',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'array',
          items: candidateSchema
        },
        401: errorSchema,
        500: errorSchema
      }
    }
  }, candidateController.getAllCandidates.bind(candidateController));

  // Buscar candidatos compatíveis com uma vaga
  app.get('/jobs/:jobId/getMatchingCandidates', {
    schema: {
      tags: ['Candidates'],
      summary: 'Buscar candidatos compatíveis',
      description: 'Retorna candidatos compatíveis com uma vaga específica, ordenados por score de compatibilidade',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['jobId'],
        properties: {
          jobId: { 
            type: 'string',
            description: 'ID da vaga para buscar candidatos compatíveis'
          }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              skills: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              experienceYears: { type: 'number' },
              score: { 
                type: 'number', 
                minimum: 0, 
                maximum: 100,
                description: 'Score de compatibilidade com a vaga'
              }
            }
          }
        },
        404: errorSchema,
        401: errorSchema,
        500: errorSchema
      }
    }
  }, candidateController.getMatchingCandidates.bind(candidateController));

  app.post('/invitations', {
    schema: {
      tags: ['Candidates'],
      summary: 'Convidar candidato para vaga',
      description: 'Cria um convite para um candidato específico para uma vaga',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['jobId', 'candidateId'],
        properties: {
          jobId: { 
            type: 'string',
            description: 'ID da vaga para qual o candidato será convidado'
          },
          candidateId: { 
            type: 'string',
            description: 'ID do candidato a ser convidado'
          }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            jobId: { type: 'string' },
            candidateId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            job: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' }
              }
            },
            candidate: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', format: 'email' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'boolean' },
            message: { type: 'string' },
            alreadyInvited: { type: 'boolean' }
          }
        },
        404: errorSchema,
        401: errorSchema,
        500: errorSchema
      }
    }
  }, candidateController.inviteCandidate.bind(candidateController));
}
