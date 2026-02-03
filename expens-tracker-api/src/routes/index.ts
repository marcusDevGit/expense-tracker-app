import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import walletRoutes from "../modules/wallets/wallet.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js";
import expenseRoutes from "../modules/expenses/expense.routes.js";
import statsRoutes from "../modules/stats/stats.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/wallets", walletRoutes);
router.use("/categories", categoryRoutes);
router.use("/expenses", expenseRoutes);
router.use("/stats", statsRoutes);

export default router;
