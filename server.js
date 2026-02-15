require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const eventRoutes = require("./routes/events");

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
