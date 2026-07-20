const express = require("express");

const router = express.Router();

const listingController = require("../controllers/listingController");
const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../config/multer");

// API - Get all listings
// Marketplace page
router.get("/", listingController.showMarketplace);

// Marketplace API
router.get("/api", listingController.getListingsAPI);

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
    upload.single("image"),
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
    upload.single("image"),
    listingController.updateListing
);

router.get("/:id", listingController.showListing);

module.exports = router;