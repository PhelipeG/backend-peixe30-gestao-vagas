import 'dotenv/config';
import { createApp } from './config/app';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';
import { startServer } from './utils/startup';

async function bootstrap() {
  const app = createApp();
  
  await registerPlugins(app);
  await registerRoutes(app);

  await startServer(app);
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao inicializar o servidor:', error);
  process.exit(1);
});