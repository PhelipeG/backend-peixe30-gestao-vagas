import { FastifyInstance } from "fastify";
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Peixe30 Jobs API',
        description: 'API para gerenciamento de vagas e candidatos',
        version: '1.0.0',
      },
      servers: [
        { 
          url: 'http://localhost:3333', 
          description: 'Development' 
        },
        { 
          url: 'https://backend-peixe30-gestao-vagas.onrender.com', 
          description: 'Production' 
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });
}