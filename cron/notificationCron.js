const cron = require("node-cron");
const Notification = require("../models/Notification");
const User = require("../models/user");
const notify = require("../utils/notify");



cron.schedule("0 * * * *", async () => {
  console.log("⏰ Hourly notifications");

  const users = await User.find({
    "preferences.frequency": "hourly",
    fcmToken: { $exists: true, $ne: "" }
  });

  for (const user of users) {
    const notifications = await Notification.find({
      userId: user._id,
      sent: false
    });

    if (notifications.length === 0) continue;

    const body = notifications.map(n => n.body).join("\n");

    await notify("📰 Hourly News", body, {}, [user.fcmToken]);

    await Notification.updateMany(
      { userId: user._id },
      { sent: true }
    );
  }
});


cron.schedule("0 9 * * *", async () => {
  console.log("📅 Daily notifications");

  const users = await User.find({
    "preferences.frequency": "daily",
    fcmToken: { $exists: true, $ne: "" }
  });

  for (const user of users) {
    const notifications = await Notification.find({
      userId: user._id,
      sent: false
    });

    if (notifications.length === 0) continue;

    const body = notifications.map(n => n.body).join("\n");

    await notify("📰 Daily News", body, {}, [user.fcmToken]);

    await Notification.updateMany(
      { userId: user._id },
      { sent: true }
    );
  }
});