import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { statusCode = 500, message } = error;

  reply.status(statusCode).send({
    error: true,
    message: statusCode >= 500 ? 'Erro interno do servidor' : message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: request.url,
  });
}
