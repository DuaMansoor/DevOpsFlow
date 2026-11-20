const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Load env variables before anything else reads them
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration (origin must NOT include a path like /api)
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

// Health check
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    message: "DevOpsFlow API is running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Unmatched routes: shows exactly what the server received
app.use((req, res) => {
  console.warn(`404 - no route for ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(`DevOpsFlow backend running on port ${PORT}`);
      console.log(`Auth routes mounted at /api/auth (login, register, me, logout)`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
};

startServer();