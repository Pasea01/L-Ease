const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.get(
    "/",
    authMiddleware,
    messageController.showInbox
);

router.post(
    "/send",
    authMiddleware,
    messageController.sendMessage
);

router.get(
    "/:assetId/:otherUserId",
    authMiddleware,
    messageController.showConversation
);

router.post(
    "/send",
    authMiddleware,
    messageController.sendMessage
);
module.exports = router;