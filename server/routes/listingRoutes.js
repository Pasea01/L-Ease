const express = require("express");

const router = express.Router();

const listingController = require("../controllers/listingController");
const authMiddleware = require("../middleware/authMiddleware");

// API - Get all listings
router.get("/", listingController.getListings);

// Page - My Listings
router.get(
    "/my-listings",
    authMiddleware,
    listingController.showMyListings
);

// Create listing
router.post(
    "/create",
    authMiddleware,
    listingController.createListing
);
// Delete listing
router.get(
    "/delete/:id",
    authMiddleware,
    listingController.deleteListing
);
// Show edit page
router.get(
    "/edit/:id",
    authMiddleware,
    listingController.showEditListing
);

// Update listing
router.post(
    "/edit/:id",
    authMiddleware,
    listingController.updateListing
);

router.get("/:id", listingController.showListing);

module.exports = router;