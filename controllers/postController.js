const Post = require("../models/Post");

// @desc    Get all posts (for students based on their group)
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "active" } = req.query;
    const skip = (page - 1) * limit;

    let query = { status };

    // If student, filter by their group
    if (req.user.role === "student") {
      query.targetGroups = req.user.group;
    }

    const posts = await Post.find(query)
      .populate("createdBy", "username email")
      .sort({ deadline: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("createdBy", "username email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private/Professor
exports.createPost = async (req, res) => {
  try {
    const { title, description, postType, deadline, targetGroups, targetSubgroups, attachments, priority } = req.body;

    const post = await Post.create({
      title,
      description,
      postType,
      deadline,
      targetGroups,
      targetSubgroups,
      attachments,
      priority,
      createdBy: req.user._id,
    });

    await post.populate("createdBy", "username email");

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private/Professor
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is the creator
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "username email");

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private/Professor
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is the creator
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

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

// @desc    Get professor's posts
// @route   GET /api/posts/professor/dashboard
// @access  Private/Professor
exports.getProfessorPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "all" } = req.query;
    const skip = (page - 1) * limit;

    let query = { createdBy: req.user._id };

    if (status !== "all") {
      query.status = status;
    }

    const posts = await Post.find(query)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
