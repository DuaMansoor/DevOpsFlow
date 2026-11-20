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

// @desc    Update a pipeline
// @route   PUT /api/pipelines/:id
const updatePipeline = async (req, res) => {
  try {
    const { name, repositoryUrl, branch } = req.body;

    const pipeline = await Pipeline.findByIdAndUpdate(
      req.params.id,
      {
        name,
        repositoryUrl,
        branch,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Pipeline not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pipeline updated successfully",
      data: pipeline,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a pipeline
// @route   DELETE /api/pipelines/:id
const deletePipeline = async (req, res) => {
  try {
    const pipeline = await Pipeline.findByIdAndDelete(req.params.id);

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Pipeline not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pipeline deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPipeline,
  getPipelines,
  updatePipeline,
  deletePipeline,
};
