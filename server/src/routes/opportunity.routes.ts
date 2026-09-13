import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getOpportunities,
  getOpportunityById,
} from "../controllers/opportunity.controller";

const router = Router();

router.get("/", authenticate, getOpportunities);
router.get("/:id", authenticate, getOpportunityById);

export default router;
