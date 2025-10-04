import { FastifyInstance } from "fastify";
import { env } from "../config/env";

export async function startServer(app: FastifyInstance) {
  try {
    await app.listen({ 
      port: env.PORT, 
      host: env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost' 
    });
    
    console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`);
    console.log(`📚 Ambiente: ${env.NODE_ENV}`);
    console.log(`🏥 Health check: http://localhost:${env.PORT}/health`);
    
    if (env.NODE_ENV === 'development') {
      console.log(`📖 Swagger docs: http://localhost:${env.PORT}/docs`);
    }
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}