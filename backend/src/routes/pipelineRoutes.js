const express = require("express");
const router = express.Router();

const {
  createPipeline,
  getPipelines,
  updatePipeline,
  deletePipeline,
} = require("../controllers/pipelineController");

// GET /api/pipelines - Get all pipelines
router.get("/", getPipelines);

// POST /api/pipelines - Create pipeline
router.post("/", createPipeline);

// PUT /api/pipelines/:id - Update pipeline
router.put("/:id", updatePipeline);

// DELETE /api/pipelines/:id - Delete pipeline
router.delete("/:id", deletePipeline);

module.exports = router;