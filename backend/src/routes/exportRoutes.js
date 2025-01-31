import { Router } from "express";
const router = Router();

// Endpoint to handle exporting canvas data
router.post("/", (req, res) => {
  const { layoutData } = req.body;
 

  if (!layoutData) {
    return res.status(400).json({ message: "No layout data provided." });
  }

  // You could save the data to the server or process it further
  console.log("Received layout data:", layoutData);

  res.status(200).json({ message: "Layout exported successfully!" });
});

export default router;