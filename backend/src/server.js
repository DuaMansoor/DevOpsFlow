
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require("./config/db");

// Import routes from both branches
const authRoutes = require("./routes/authRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");

// Initialize Express
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:5173")
      .trim()
      .replace(/\/+$/, ""),
    credentials: true,
  })
);

// Request middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Authentication routes
app.use("/api/auth", authRoutes);

// Pipeline routes
app.use("/api/pipelines", pipelineRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    message: "DevOpsFlow API is running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

// Handle unmatched routes
app.use((req, res) => {
  console.warn(
    `404 - no route for ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Validate required environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `DevOpsFlow backend running on port ${PORT}`
      );

      console.log(
        "Authentication routes: /api/auth"
      );

      console.log(
        "Pipeline routes: /api/pipelines"
      );

      console.log(
        "Health endpoint: /api/health"
      );
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
};

startServer();
