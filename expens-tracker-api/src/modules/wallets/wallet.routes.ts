import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { WalletController } from "./wallet.controller.js";

const router = Router();
const walletController = new WalletController();

router.use(authMiddleware);

router.post("/", walletController.create.bind(walletController));
router.get("/", walletController.list.bind(walletController));
router.get("/:id", walletController.show.bind(walletController));
router.put("/:id", walletController.update.bind(walletController));
router.delete("/:id", walletController.delete.bind(walletController));
router.get("/:id/dashboard", walletController.dashboard.bind(walletController));

export default router;
