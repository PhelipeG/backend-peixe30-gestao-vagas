import 'dotenv/config'
import fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env";
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth.routes';
import { jobRoutes } from './routes/job.routes';
import { candidateRoutes } from './routes/candidate.routes';

const app = fastify({
  logger: true,
})

app.register(cors, {
  origin: true,
  credentials: true,
})
app.register(jwt, {
  secret: env.JWT_SECRET,
})

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
    };
    user: {
      sub: string;
      email: string;
    };
  }
}

app.get('/health', async () => {
  return { 
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
});

app.register(authRoutes, { prefix: '/api/auth' }); 
app.register(jobRoutes, { prefix: '/api/jobs' });
app.register(candidateRoutes, { prefix: '/api/candidates' });

const start = async () => {
  try{
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    console.log(`📚 Environment: ${env.NODE_ENV}`);
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}
start();