const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
      trim: true,
      maxlength: [150, "Subject cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    eventDate: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    location: {
      type: String,
      sparse: true,
    },
    imageUrl: {
      type: String,
      sparse: true,
    },
    imagePublicId: {
      type: String,
      sparse: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["technical", "cultural", "sports", "academic", "other"],
      default: "other",
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
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
eventSchema.index({ createdBy: 1, createdAt: -1 });
eventSchema.index({ eventDate: 1 });

// Plugin for pagination
eventSchema.plugin(require("mongoose-aggregate-paginate-v2"));

module.exports = mongoose.model("Event", eventSchema);
