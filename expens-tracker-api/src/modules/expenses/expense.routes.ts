import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { ExpenseController } from "./expense.controller.js";

const router = Router();
const controller = new ExpenseController();

router.use(authMiddleware);

router.post("/", controller.create.bind(controller));
router.get("/", controller.list.bind(controller));
router.get("/:id", controller.show.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
