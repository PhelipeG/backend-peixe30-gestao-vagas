import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string(),
  DEFAULT_USER_EMAIL: z.string().email(),
  DEFAULT_USER_PASSWORD: z.string().min(6)
})
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Variáveis de ambiente inválidas:", _env.error.format());
  throw new Error("Variáveis de ambiente inválidas. Verifique o console para mais detalhes.");
}
export const env = _env.data; 