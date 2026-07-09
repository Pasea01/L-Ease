const Listing = require("../models/Listing");

function getListings(req, res) {

    Listing.getAllListings((err, listings) => {

        if (err) {

            return res.status(500).json({
                error: "Database error"
            });

        }

        res.json(listings);

    });

}

module.exports = {

    getListings

};