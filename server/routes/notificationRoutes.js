const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const notificationController = require("../controllers/notificationController");

// ======================================
// Open Notification
// ======================================

router.get(

    "/:id",

    authMiddleware,

    notificationController.openNotification

);

// ======================================
// Mark All As Read
// ======================================

router.post(

    "/mark-all-read",

    authMiddleware,

    notificationController.markAllAsRead

);

module.exports = router;