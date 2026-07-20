const Listing = require("../models/Listing");

// =====================================
// Get all listings (Marketplace API)
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

    Listing.search(

        search,
        category,

        (err, listings) => {

            if (err) {

                console.error(err);

                return res.send("Error loading marketplace.");

            }

            res.render("marketplace", {

                user: req.session.user,

                listings,

                search,

                category

            });

        }

    );

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
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price_per_day: req.body.price_per_day,
    location: req.body.location,
    image_url: req.file ? req.file.filename : null

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

    Listing.getById( listingId, ownerId, (err, existingListing) => {

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

    });

};
// =====================================
// Show Single Listing
// =====================================

exports.showListing = (req, res) => {

    const id = req.params.id;

    Listing.getListingById(id, (err, listing) => {

        if (err) {

            console.error(err);

            return res.send("Failed to load listing.");

        }

        if (!listing) {

            return res.send("Listing not found.");

        }

        res.render("listing-details", {

            listing,
            user: req.session.user || null

        });

    });

};