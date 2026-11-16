const Listing = require("../models/Listing");

const listingCategories = new Set([
    "Property",
    "Vehicle",
    "Electronics",
    "Furniture",
    "Tools",
    "Equipment",
    "Livestock",
    "Other"
]);

const getValidatedListing = (body) => {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string"
        ? body.description.trim()
        : "";
    const category = typeof body.category === "string" ? body.category : "";
    const location = typeof body.location === "string"
        ? body.location.trim()
        : "";
    const rawPrice = typeof body.price_per_day === "string"
        ? body.price_per_day.trim()
        : "";
    const price = Number(rawPrice);

    if (
        title.length < 3
        || title.length > 100
        || description.length > 2000
        || !listingCategories.has(category)
        || !rawPrice
        || !Number.isFinite(price)
        || price <= 0
        || location.length < 2
        || location.length > 100
    ) {
        return null;
    }

    return {
        title,
        description,
        category,
        price_per_day: price,
        location
    };
};

// =====================================
// Get all listings (API)
// =====================================

exports.getListingsAPI = (req, res, next) => {

    Listing.getAllListings((err, listings) => {

        if (err) {
            return next(err);

        }

        res.json(listings);

    });

};

// =====================================
// Marketplace Page
// =====================================

exports.showMarketplace = (req, res, next) => {

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
                return next(err);

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

exports.showMyListings = (req, res, next) => {

    Listing.getUserListings(

        req.session.user.id,

        (err, listings) => {

            if (err) {
                return next(err);

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

exports.createListing = (req, res, next) => {

    const validatedListing = getValidatedListing(req.body);

    if (!validatedListing) {
        req.session.flash = {
            type: "error",
            message: "Check the listing details: title, category, price and location are required, and descriptions must be under 2,000 characters."
        };
        return res.redirect("/listings/new");
    }

    const listing = {

        owner_id: req.session.user.id,
        ...validatedListing,
        image_url: req.file ? req.file.filename : null

    };

    Listing.create(

        listing,

        (err) => {

            if (err) {
                return next(err);

            }

            res.redirect("/listings/my-listings");

        }

    );

};

// =====================================
// Delete Listing
// =====================================

exports.deleteListing = (req, res, next) => {

    Listing.deleteListing(

        req.params.id,

        req.session.user.id,

        (err) => {

            if (err) {
                return next(err);

            }

            res.redirect("/listings/my-listings");

        }

    );

};

// =====================================
// Edit Listing Page
// =====================================

exports.showEditListing = (req, res, next) => {

    Listing.getById(

        req.params.id,

        req.session.user.id,

        (err, listing) => {

            if (err) {
                return next(err);
            }

            if (!listing) {
                const error = new Error("Listing not found.");
                error.status = 404;
                return next(error);

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

exports.updateListing = (req, res, next) => {

    const listingId = req.params.id;

    const ownerId = req.session.user.id;
    const validatedListing = getValidatedListing(req.body);

    if (!validatedListing) {
        req.session.flash = {
            type: "error",
            message: "Check the listing details: title, category, price and location are required, and descriptions must be under 2,000 characters."
        };
        return res.redirect(`/listings/edit/${encodeURIComponent(listingId)}`);
    }

    Listing.getById(

        listingId,

        ownerId,

        (err, existingListing) => {

            if (err) {
                return next(err);
            }

            if (!existingListing) {
                const error = new Error("Listing not found.");
                error.status = 404;
                return next(error);

            }

            const listing = {

                ...validatedListing,

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
                        return next(err);

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

exports.showListing = (req, res, next) => {

    const listingId = req.params.id;

    Listing.getListingById(

        listingId,

        (err, listing) => {

            if (err) {
                return next(err);
            }

            if (!listing) {
                const error = new Error("Listing not found.");
                error.status = 404;
                return next(error);

            }

            Listing.getListingRating(

                listingId,

                (err, rating) => {

                    if (err) {
                        return next(err);

                    }

                    Listing.getListingReviews(

                        listingId,

                        (err, reviews) => {

                            if (err) {
                                return next(err);

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