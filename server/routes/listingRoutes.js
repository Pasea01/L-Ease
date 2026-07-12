const express = require("express");

const router = express.Router();

const listingController = require("../controllers/listingController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all listings (API)
router.get("/", listingController.getListings);

// Create a new listing
router.post(
    "/create",
    authMiddleware,
    listingController.createListing
);

module.exports = router;