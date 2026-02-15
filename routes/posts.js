const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getProfessorPosts,
} = require("../controllers/postController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getPosts);
router.get("/professor/dashboard", protect, authorize("professor"), getProfessorPosts);
router.get("/:id", protect, getPost);
router.post("/", protect, authorize("professor"), createPost);
router.put("/:id", protect, authorize("professor"), updatePost);
router.delete("/:id", protect, authorize("professor"), deletePost);

module.exports = router;
