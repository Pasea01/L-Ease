const Listing = require("../models/Listing");

// --------------------------
// Get all listings
// --------------------------

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

// --------------------------
// Create a new listing
// --------------------------

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

        res.redirect("/dashboard");

    });

};