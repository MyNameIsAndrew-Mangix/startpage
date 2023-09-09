import express from "express";
import * as CategoriesController from "../controllers/category";

const router = express.Router();

router.get("/", CategoriesController.getCategories);

router.get("/:categoryId", CategoriesController.getCategory);
router.post("", CategoriesController.createCategory);
router.patch("/:categoryId", CategoriesController.updateCategory);
router.delete("/:categoryId", CategoriesController.deleteCategory);

router.get("/:categoryId/workspace", CategoriesController.getWorkspaces);

router.get("/:categoryId/workspace/:workspaceId", CategoriesController.getWorkspace);
router.post("/:categoryId/workspace", CategoriesController.createWorkspace);
router.post("/workspace", CategoriesController.createWorkspace);
router.patch("/:categoryId/workspace/:workspaceId", CategoriesController.updateWorkspace);
router.delete("/:categoryId/workspace/:workspaceId", CategoriesController.deleteWorkspace);

router.get("/workspace/:workspaceId/site/:siteId", CategoriesController.getSite);
router.post("/workspace/:workspaceId/site", CategoriesController.createSite);
router.put("/workspace/:workspaceId/site/:siteId", CategoriesController.updateSite);
router.delete("/workspace/:workspaceId/site/:siteId", CategoriesController.deleteSite);

export default router;