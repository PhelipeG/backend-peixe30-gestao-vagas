import { FastifyInstance } from 'fastify';

import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { errorSchema, userSchema } from '../schemas';

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/login',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Fazer login',
        description: 'Autentica um usuário e retorna um JWT token',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
              minLength: 6,
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: userSchema,
            },
          },
          401: errorSchema,
          400: errorSchema,
        },
      },
    },
    authController.login.bind(authController)
  );
  app.get('/me', {
    schema: {
      tags: ['Authentication'],
      summary: 'Obter dados do usuário logado',
      description:
        'Retorna os dados do usuário autenticado baseado no token JWT',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            user: userSchema,
          },
        },
        401: errorSchema,
        500: errorSchema,
      },
    },
    onRequest: [authMiddleware],
    handler: authController.me.bind(authController),
  });
}
