import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { errorMiddleware } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import resumeRoutes from "./routes/resume.routes";
import opportunityRoutes from "./routes/opportunity.routes";
const app = express();

const allowedOrigins = env.clientUrl
  ? env.clientUrl.split(",").map((o) => o.trim()).filter(Boolean)
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, automated health checks, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "KARYO API",
    status: "operational",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(
      `KARYO API running on http://localhost:${env.port}`
    );
    if (!env.geminiApiKey) {
      console.warn(
        "[KARYO CONFIG] Notice: GEMINI_API_KEY is not configured in server/.env. AI resume analysis will require a valid Gemini API key."
      );
    } else {
      console.log("[KARYO CONFIG] Gemini AI Engine active.");
    }
  });
};

void startServer();