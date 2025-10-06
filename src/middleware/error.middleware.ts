import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { statusCode = 500, message } = error;

  reply.status(statusCode).send({
    error: true,
    message: statusCode >= 500 ? 'Internal Server Error' : message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: request.url,
  });
}
