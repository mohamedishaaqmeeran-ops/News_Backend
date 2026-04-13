const admin = require("./firebase");

const sendPushNotification = async (token, title, body) => {
    try {
        console.log("🚀 Sending notification to token:", token);

        const message = {
            notification: { title, body },
            token,
        };

        const response = await admin.messaging().send(message);

        console.log("✅ Push sent:", response);

    } catch (error) {
        console.error("❌ Push error:", error);
    }
};

module.exports = sendPushNotification;