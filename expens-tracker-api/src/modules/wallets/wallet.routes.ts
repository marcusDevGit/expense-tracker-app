import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { WalletController } from "./wallet.controller.js";

const router = Router();
const walletController = new WalletController();

router.use(authMiddleware);
router.get("/", walletController.list.bind(walletController));
router.get(
  "/:walletId/dashboard",
  walletController.dashboard.bind(walletController),
);

export default router;
