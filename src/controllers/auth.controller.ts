import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { AuthService } from '../services/auth.service';

const authService = new AuthService();

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body);
      const result = await authService.login(body);

      if (!result) {
        return reply.status(401).send({
          error: 'Nao autorizado',
          message: 'Credenciais Invalidas',
        });
      }
      const token = request.server.jwt.sign({
        sub: result.user.id,
        email: result.user.email,
      });
      return reply.status(200).send({
        token,
        user: result.user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validação',
          message: error.message,
        });
      }
      console.error('Erro ao fazer login:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Erro durante o login',
      });
    }
  }
  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub;

      return reply.status(200).send({
        user: {
          id: userId,
          email: request.user.email,
        },
      });
    } catch (error) {
      console.error('Me error:', error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An error occurred',
      });
    }
  }
}
