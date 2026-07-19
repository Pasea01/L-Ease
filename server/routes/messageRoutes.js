const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.get(
    "/",
    authMiddleware,
    messageController.showInbox
);

router.get(
    "/:assetId/:otherUserId",
    authMiddleware,
    messageController.showConversation
);

module.exports = router;