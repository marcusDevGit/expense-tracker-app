import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();
const authcontroller = new AuthController();

router.post("/login", authcontroller.login);
router.post("/logout", authcontroller.logout);
router.post("/refresh", authcontroller.refresh);

export default router;
