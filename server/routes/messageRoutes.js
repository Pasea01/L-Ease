const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.get(
    "/",
    authMiddleware,
    messageController.showInbox
);

module.exports = router;