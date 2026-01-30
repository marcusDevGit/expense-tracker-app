import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import walletRoutes from "../modules/wallets/wallet.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/wallets", walletRoutes);

export default router;
