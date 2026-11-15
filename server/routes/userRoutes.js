const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");

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
    upload.single("profile_image"),
    userController.updateProfile
);

router.get(
    "/profile/reviews",
    authMiddleware,
    userController.showReviews
);

module.exports = router;