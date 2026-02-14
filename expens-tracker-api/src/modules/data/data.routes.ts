import { Router } from "express";
import { DataController } from "./data.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();
const dataController = new DataController();

router.get("/export", authMiddleware, dataController.export);
router.post("/reset", authMiddleware, dataController.reset);

export default router;