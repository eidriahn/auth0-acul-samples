import { z } from "zod";

const envSchema = z.object({
  VITE_AUTH0_CLIENT_ID: z.string(),
  VITE_AUTH0_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(import.meta.env);
