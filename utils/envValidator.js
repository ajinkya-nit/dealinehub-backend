const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Check if all required environment variables are set
const requiredEnvs = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CORS_ORIGIN",
];

const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

if (missingEnvs.length > 0) {
  console.error("❌ Missing environment variables:", missingEnvs);
  console.error("Please update your .env file with all required variables");
  process.exit(1);
}

console.log("✅ Environment variables are correctly configured");
console.log("📦 Backend server is ready to start");
