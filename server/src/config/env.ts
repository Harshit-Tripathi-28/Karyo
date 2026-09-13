import path from "node:path";
import dotenv from "dotenv";

// Load environment variables reliably across execution contexts
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

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
  get geminiApiKey(): string {
    return (
      process.env.GEMINI_API_KEY?.trim() ||
      process.env.GOOGLE_API_KEY?.trim() ||
      ""
    );
  },
  get geminiModel(): string {
    return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  },
  get jobCacheTtlMinutes(): number {
    const val = Number(process.env.JOB_CACHE_TTL_MINUTES);
    return !isNaN(val) && val > 0 ? val : 15;
  },
  get adzunaAppId(): string {
    return process.env.ADZUNA_APP_ID?.trim() || "";
  },
  get adzunaApiKey(): string {
    return process.env.ADZUNA_APP_KEY?.trim() || "";
  },
};