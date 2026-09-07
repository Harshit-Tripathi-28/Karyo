import { Router } from "express";

import {
  deleteResume,
  getResumeAnalysis,
  uploadAndAnalyzeResume,
} from "../controllers/resume.controller";
import { authenticate } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/upload.middleware";

const router = Router();

router.use(authenticate);

router.get("/analysis", getResumeAnalysis);

router.post(
  "/analyze",
  uploadResume.single("resume"),
  uploadAndAnalyzeResume
);

router.delete("/", deleteResume);

export default router;