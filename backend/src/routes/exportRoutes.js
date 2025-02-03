import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();

// Endpoint to handle exporting canvas data (Already Working)
router.post("/", (req, res) => {
  const { layoutData } = req.body;

  if (!layoutData) {
    return res.status(400).json({ message: "No layout data provided." });
  }

  console.log("Received layout data:", layoutData);

  res.status(200).json({ message: "Layout exported successfully!" });
});

// Set up storage for floor plan images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/floorplans";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `floorplan-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Endpoint to handle floor plan upload
router.post("/upload-floorplan", upload.single("floorPlan"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = `/floorplans/${req.file.filename}`;
  console.log("Floor plan saved at:", filePath);
  
  res.status(200).json({ message: "Floor plan uploaded successfully!", imageUrl: filePath });
});

// Endpoint to fetch the latest floor plan (for when the page reloads)
router.get("/get-floorplan", (req, res) => {
  const dir = "public/floorplans";

  if (!fs.existsSync(dir)) {
    return res.status(404).json({ message: "No floor plan found." });
  }

  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return res.status(404).json({ message: "No floor plan found." });
  }

  // Get the latest uploaded floor plan
  const latestFile = files.sort((a, b) => fs.statSync(path.join(dir, b)).mtimeMs - fs.statSync(path.join(dir, a)).mtimeMs)[0];
  res.status(200).json({ imageUrl: `/floorplans/${latestFile}` });
});

export default router;