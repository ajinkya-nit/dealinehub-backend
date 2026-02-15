const Event = require("../models/Event");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, status = "active" } = req.query;
    const skip = (page - 1) * limit;

    let query = { status };

    if (category) {
      query.category = category;
    }

    const events = await Event.find(query)
      .populate("createdBy", "username avatar")
      .populate("likedBy", "username")
      .populate("comments.user", "username avatar")
      .sort({ eventDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pages: Math.ceil(total / limit),
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "username avatar email")
      .populate("likedBy", "username avatar")
      .populate("comments.user", "username avatar");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { subject, description, eventDate, location, imageUrl, imagePublicId, category } = req.body;

    const event = await Event.create({
      subject,
      description,
      eventDate,
      location,
      imageUrl,
      imagePublicId,
      category,
      createdBy: req.user._id,
    });

    await event.populate("createdBy", "username avatar");

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "username avatar");

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Like event
// @route   PUT /api/events/:id/like
// @access  Private
exports.likeEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user already liked
    if (event.likedBy.includes(req.user._id)) {
      event.likedBy = event.likedBy.filter((id) => id.toString() !== req.user._id.toString());
      event.likes -= 1;
    } else {
      event.likedBy.push(req.user._id);
      event.likes += 1;
    }

    await event.save();
    await event.populate("likedBy", "username avatar");

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Add comment to event
// @route   POST /api/events/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Please provide comment text",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.comments.push({
      user: req.user._id,
      text,
    });

    await event.save();
    await event.populate("comments.user", "username avatar");

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
