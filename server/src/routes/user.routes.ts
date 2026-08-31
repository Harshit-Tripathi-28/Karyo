import { Router } from "express";
import {
  getCurrentUser,
  updateProfile,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/me", getCurrentUser);
router.patch("/profile", updateProfile);

export default router;