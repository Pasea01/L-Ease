const Listing = require("../models/Listing");

// =====================================
// Get all listings (Marketplace API)
// =====================================

exports.getListings = (req, res) => {

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
// Show logged-in user's listings
// =====================================

exports.showMyListings = (req, res) => {

    const ownerId = req.session.user.id;

    Listing.getUserListings(ownerId, (err, listings) => {

        if (err) {

            console.error(err);

            return res.send("Failed to load listings.");

        }

        res.render("my-listings", {

            user: req.session.user,
            listings

        });

    });

};

// =====================================
// Create listing
// =====================================

exports.createListing = (req, res) => {

    const {

        title,
        description,
        category,
        price_per_day,
        location

    } = req.body;

    const listing = {

        owner_id: req.session.user.id,
        title,
        description,
        category,
        price_per_day,
        location

    };

    Listing.create(listing, (err) => {

        if (err) {

            console.error(err);

            return res.send("Failed to create listing.");

        }

        res.redirect("/listings/my-listings");

    });

};
// =====================================
// Delete Listing
// =====================================

exports.deleteListing = (req, res) => {

    const listingId = req.params.id;
    const ownerId = req.session.user.id;

    Listing.deleteListing(listingId, ownerId, (err) => {

        if (err) {

            console.error(err);

            return res.send("Failed to delete listing.");

        }

        res.redirect("/listings/my-listings");

    });

};

// =====================================
// Show Edit Listing Page
// =====================================

exports.showEditListing = (req, res) => {

    const listingId = req.params.id;
    const ownerId = req.session.user.id;

    Listing.getById(listingId, ownerId, (err, listing) => {

        if (err) {

            console.error(err);
            return res.send("Failed to load listing.");

        }

        if (!listing) {

            return res.send("Listing not found.");

        }

        res.render("edit-listing", {

            user: req.session.user,
            listing

        });

    });

};

// =====================================
// Update Listing
// =====================================

exports.updateListing = (req, res) => {

    const listingId = req.params.id;
    const ownerId = req.session.user.id;

    const {

        title,
        description,
        category,
        price_per_day,
        location

    } = req.body;

    const listing = {

        title,
        description,
        category,
        price_per_day,
        location

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

};