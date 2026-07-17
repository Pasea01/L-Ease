const Listing = require("../models/Listing");

exports.showHome = (req, res) => {

    Listing.getAllListings((err, listings) => {

        if (err) {

            console.error(err);

            return res.render("index", {
                listings: [],
                user: req.session.user || null
            });

        }

        res.render("index", {

            listings,
            user: req.session.user || null

        });

    });

};