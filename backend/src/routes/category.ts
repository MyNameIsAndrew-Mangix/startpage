import express from "express";
import * as WorkspacesController from "../controllers/category";

const router = express.Router();

router.get("/", WorkspacesController.getCategories);
router.post("/", WorkspacesController.getCategories);

export default router;