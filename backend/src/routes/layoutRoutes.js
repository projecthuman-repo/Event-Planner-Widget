import express from "express";
import { getLayouts, saveLayout, deleteLayout } from "../controllers/layoutController.js";

const router = express.Router();

router.get("/", getLayouts); // Fetch layouts
router.post("/", saveLayout); // Save a new layout
router.delete("/:id", deleteLayout); // Delete a layout by ID

export default router;