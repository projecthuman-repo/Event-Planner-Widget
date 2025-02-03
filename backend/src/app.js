import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend requests
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));

// Increase payload size limit (useful for large images)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files (Floor Plans & Exports)
app.use("/floorplans", express.static(path.join(path.resolve(), "public/floorplans")));
app.use("/exports", express.static(path.join(path.resolve(), "public/exports")));

// Routes
import layoutRoutes from "./routes/layoutRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

app.use("/api/layouts", layoutRoutes);
app.use("/api/export", exportRoutes);

// Serve static frontend files (for deployment)
app.use(express.static(path.join(path.resolve(), "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "index.html"));
});

// Debugging log
console.log("Backend is running and serving static files properly!");

// Export the app
export default app;