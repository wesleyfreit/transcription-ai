import z from 'zod';

const envSchema = z.object({
  AI_KEY: z.string(),
  R2_ENDPOINT: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('⚠️  Invalid environment variables!', _env.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
