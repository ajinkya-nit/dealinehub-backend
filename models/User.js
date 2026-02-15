const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "professor", "admin"],
      default: "student",
    },
    avatar: {
      type: String,
      default: null,
    },
    // Student-specific fields
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    branch: {
      type: String,
      enum: ["CSE", "ECE", "ME", "CE", "EEE", "MME", "ARCH"],
      sparse: true,
    },
    group: {
      type: String,
      enum: ["A1", "A2", "A3", "A4", "A5", "A6", "B1", "B2", "B3", "B4", "B5", "B6"],
      sparse: true,
    },
    subgroup: {
      type: String,
      sparse: true,
    },
    // Professor-specific fields
    department: {
      type: String,
      sparse: true,
    },
    designation: {
      type: String,
      sparse: true,
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
