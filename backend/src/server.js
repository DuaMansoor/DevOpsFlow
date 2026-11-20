const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Import routes
const pipelineRoutes = require("./routes/pipelineRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/pipelines", pipelineRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    message: "DevOpsFlow API is running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`DevOpsFlow backend running on port ${PORT}`);
  });
};

startServer();
