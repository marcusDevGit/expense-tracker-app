import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.put("/password", authMiddleware, userController.updatePassword);
router.delete("/profile", authMiddleware, userController.deleteProfile);

export default router;
