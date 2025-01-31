import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from the frontend
  methods: ["GET", "POST", "DELETE", "OPTIONS"], // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));
app.use(bodyParser.json());

// Routes
import layoutRoutes from "./routes/layoutRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

app.use("/api/layouts", layoutRoutes);
app.use("/api/export", exportRoutes);

// Serve static files from the frontend build folder (for deployment)
app.use(express.static(path.join(path.resolve(), "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "index.html"));
});

// Export the app as the default export
export default app;