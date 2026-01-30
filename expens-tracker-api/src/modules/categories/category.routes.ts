import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { CategoryController } from "./category.controller.js";

const router = Router();
const categoryController = new CategoryController();

router.use(authMiddleware);

router.post("/", categoryController.create.bind(categoryController));
router.get("/", categoryController.list.bind(categoryController));
router.get("/:id", categoryController.show.bind(categoryController));
router.put("/:id", categoryController.update.bind(categoryController));
router.delete("/:id", categoryController.delete.bind(categoryController));

export default router;
