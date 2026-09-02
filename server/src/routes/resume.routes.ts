import { Router } from "express";

import { uploadAndAnalyzeResume } from "../controllers/resume.controller";
import { authenticate } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/upload.middleware";

const router = Router();

router.use(authenticate);

router.post(
  "/analyze",
  uploadResume.single("resume"),
  uploadAndAnalyzeResume
);

export default router;