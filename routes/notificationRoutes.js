const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const User = require("../models/user"); 

const { isAuthenticated } = require("../middlewares/auth");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/preferences", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.preferences || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/preferences", isAuthenticated, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { preferences: req.body },
      { new: true }
    );

    res.json(updatedUser.preferences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id/read", isAuthenticated, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isRead: true }
    );

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;