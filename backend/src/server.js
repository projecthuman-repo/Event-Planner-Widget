import express from "express";
import dotenv from "dotenv";
import app from "./app.js"; // Use ES Module syntax for importing app.js

dotenv.config(); // Load environment variables from a .env file

// Set the port from environment variables or use default 5000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});