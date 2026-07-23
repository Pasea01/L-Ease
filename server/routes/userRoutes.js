const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get(
    "/profile",
    authMiddleware,
    userController.showProfile
);

router.get(
    "/profile/edit",
    authMiddleware,
    userController.showEditProfile
);

router.post(
    "/profile/edit",
    authMiddleware,
    userController.updateProfile
);

module.exports = router;