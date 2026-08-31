const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  mongoUri: requiredEnv("MONGODB_URI"),
  jwtSecret: requiredEnv("JWT_SECRET"),
  openaiApiKey: requiredEnv("OPENAI_API_KEY"),
};