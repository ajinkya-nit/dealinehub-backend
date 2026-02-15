const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    postType: {
      type: String,
      enum: ["assignment", "notes", "quiz"],
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, "Please provide a deadline"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetGroups: [
      {
        type: String,
        enum: ["A1", "A2", "A3", "A4", "A5", "A6", "B1", "B2", "B3", "B4", "B5", "B6"],
      },
    ],
    targetSubgroups: [
      {
        type: String,
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for better query performance
postSchema.index({ createdBy: 1, createdAt: -1 });
postSchema.index({ targetGroups: 1, deadline: 1 });

// Plugin for pagination
postSchema.plugin(require("mongoose-aggregate-paginate-v2"));

module.exports = mongoose.model("Post", postSchema);
