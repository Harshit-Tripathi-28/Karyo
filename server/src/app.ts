import "dotenv/config";
import express from "express";
import cors from "cors";

import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { errorMiddleware } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { Request, Response } from "express";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
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
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(
      `KARYO API running on http://localhost:${env.port}`
    );
  });
};

void startServer();