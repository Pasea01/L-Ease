const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// Submit Review
// ===============================

router.post(

    "/create",

    authMiddleware,

    reviewController.createReview

);

router.get(

    "/new/:leaseId",

    authMiddleware,

    reviewController.showReviewForm

);

module.exports = router;