const Pipeline = require("../models/Pipeline");

// @desc    Create a new pipeline
// @route   POST /api/pipelines
const createPipeline = async (req, res) => {
  try {
    const { name, repositoryUrl, branch } = req.body;

    const pipeline = await Pipeline.create({
      name,
      repositoryUrl,
      branch,
    });

    res.status(201).json({
      success: true,
      message: "Pipeline created successfully",
      data: pipeline,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all pipelines
// @route   GET /api/pipelines
const getPipelines = async (req, res) => {
  try {
    const pipelines = await Pipeline.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: pipelines.length,
      data: pipelines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pipelines",
    });
  }
};

module.exports = {
  createPipeline,
  getPipelines,
};
