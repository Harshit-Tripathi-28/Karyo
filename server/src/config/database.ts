import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    console.log("KARYO database connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};