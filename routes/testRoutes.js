const express = require("express");
const router = express.Router();

const sendPushNotification = require("../utils/pushNotification");
const User = require("../models/user");

router.get("/test-push", async (req, res) => {
    try {
        const user = await User.findOne({ fcmToken: { $exists: true } });

        if (!user) {
            return res.status(404).json({ message: "No user with token" });
        }

        await sendPushNotification(
            user.fcmToken,
            "🚨 Breaking News",
            "Push notification working!"
        );

        res.json({ success: true, message: "Push sent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;