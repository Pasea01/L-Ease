const Listing = require("../models/Listing");

// =====================================
// Get all listings (API)
// =====================================

exports.getListingsAPI = (req, res) => {

    Listing.getAllListings((err, listings) => {

        if (err) {

            return res.status(500).json({
                error: "Database error"
            });

        }

        res.json(listings);

    });

};

// =====================================
// Marketplace Page
// =====================================

exports.showMarketplace = (req, res) => {

    const search = req.query.search || "";
    const category = req.query.category || "";
    const location = req.query.location || "";
    const minPrice = req.query.minPrice || "";
    const maxPrice = req.query.maxPrice || "";
    const sort = req.query.sort || "newest";

    Listing.search(

        {

            search,
            category,
            location,
            minPrice,
            maxPrice,
            sort

        },

        (err, listings) => {

            if (err) {

                console.error(err);

                return res.send("Error loading marketplace.");

            }

            res.render("marketplace", {

                user: req.session.user,
                listings,
                search,
                category,
                location,
                minPrice,
                maxPrice,
                sort

            });

        }

    );

};

// =====================================
// User Listings
// =====================================

exports.showMyListings = (req, res) => {

    Listing.getUserListings(

        req.session.user.id,

        (err, listings) => {

            if (err) {

                console.error(err);

                return res.send("Failed to load listings.");

            }

            res.render("my-listings", {

                user: req.session.user,
                listings

            });

        }

    );

};

// =====================================
// Create Listing
// =====================================

exports.createListing = (req, res) => {

    const listing = {

        owner_id: req.session.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price_per_day: req.body.price_per_day,
        location: req.body.location,
        image_url: req.file ? req.file.filename : null

    };

    Listing.create(

        listing,

        (err) => {

            if (err) {

                console.error(err);

                return res.send("Failed to create listing.");

            }

            res.redirect("/listings/my-listings");

        }

    );

};

// =====================================
// Delete Listing
// =====================================

exports.deleteListing = (req, res) => {

    Listing.deleteListing(

        req.params.id,

        req.session.user.id,

        (err) => {

            if (err) {

                console.error(err);

                return res.send("Failed to delete listing.");

            }

            res.redirect("/listings/my-listings");

        }

    );

};

// =====================================
// Edit Listing Page
// =====================================

exports.showEditListing = (req, res) => {

    Listing.getById(

        req.params.id,

        req.session.user.id,

        (err, listing) => {

            if (err || !listing) {

                console.error(err);

                return res.send("Listing not found.");

            }

            res.render("edit-listing", {

                user: req.session.user,
                listing

            });

        }

    );

};

// =====================================
// Update Listing
// =====================================

exports.updateListing = (req, res) => {

    const listingId = req.params.id;

    const ownerId = req.session.user.id;

    Listing.getById(

        listingId,

        ownerId,

        (err, existingListing) => {

            if (err || !existingListing) {

                console.error(err);

                return res.send("Listing not found.");

            }

            const listing = {

                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price_per_day: req.body.price_per_day,
                location: req.body.location,

                image_url: req.file
                    ? req.file.filename
                    : existingListing.image_url

            };

            Listing.update(

                listingId,

                ownerId,

                listing,

                (err) => {

                    if (err) {

                        console.error(err);

                        return res.send("Failed to update listing.");

                    }

                    res.redirect("/listings/my-listings");

                }

            );

        }

    );

};

// =====================================
// Listing Details
// =====================================

exports.showListing = (req, res) => {

    const listingId = req.params.id;

    Listing.getListingById(

        listingId,

        (err, listing) => {

            if (err || !listing) {

                console.error(err);

                return res.send("Listing not found.");

            }

            Listing.getListingRating(

                listingId,

                (err, rating) => {

                    if (err) {

                        console.error(err);

                        rating = {

                            average: 0,
                            total: 0

                        };

                    }

                    Listing.getListingReviews(

                        listingId,

                        (err, reviews) => {

                            if (err) {

                                console.error(err);

                                reviews = [];

                            }

                            res.render("listing-details", {

                                user: req.session.user || null,

                                listing,

                                rating,

                                reviews

                            });

                        }

                    );

                }

            );

        }

    );

};