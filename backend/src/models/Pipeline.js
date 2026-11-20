const mongoose = require("mongoose");

const pipelineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pipeline name is required"],
      trim: true,
    },

    repositoryUrl: {
      type: String,
      required: [true, "Repository URL is required"],
      trim: true,
      match: [/^https?:\/\/.+/, "Please provide a valid repository URL"],
    },

    branch: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
      default: "main",
    },

    status: {
      type: String,
      enum: ["success", "running", "failed", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

const Pipeline = mongoose.model("Pipeline", pipelineSchema);

module.exports = Pipeline;
