import express from "express";
import * as CategoriesController from "../controllers/category";

const router = express.Router();

router.get("/", CategoriesController.getCategories);
router.post("/", CategoriesController.createCategory);
router.put("/", CategoriesController.updateCategory);
router.delete("/", CategoriesController.deleteCategory);

// router.get("/workspace", CategoriesController.getWorkspace);
router.post("/workspace", CategoriesController.createWorkspace);
// router.put("/workspace", CategoriesController.updateWorkspace);
router.delete("/workspace", CategoriesController.deleteWorkspace);

export default router;