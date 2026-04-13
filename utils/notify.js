const admin = require("../utils/firebase");

const notify = async (title, body, data = {}, tokens = []) => {
    try {
        if (!tokens || tokens.length === 0) {
            console.log("⚠️ No tokens provided");
            return;
        }

        const message = {
            tokens: tokens,
            notification: {
                title,
                body,
            },
            data: Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, String(value)])
            ),
        };

        const response = await admin.messaging().sendEachForMulticast(message);

        console.log("✅ Success count:", response.successCount);
        console.log("❌ Failure count:", response.failureCount);

        response.responses.forEach((res, idx) => {
            if (!res.success) {
                console.log(`❌ Token failed at index ${idx}:`, res.error.message);
            }
        });

    } catch (error) {
        console.error("❌ Notify error:", error);
    }
};

module.exports = notify;