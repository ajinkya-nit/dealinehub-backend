const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  likeEvent,
  addComment,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.put("/:id/like", protect, likeEvent);
router.post("/:id/comment", protect, addComment);

module.exports = router;
