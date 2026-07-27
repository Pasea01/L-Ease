const Review = require("../models/Review");
const db = require("../database/db");

// ======================================
// Show Review Form
// ======================================

exports.showReviewForm = (req, res) => {

    const leaseId = req.params.leaseId;

    db.get(

        `

        SELECT

            leases.*,

            assets.title,

            assets.id AS listing_id,

            users.id AS owner_id,

            users.full_name

        FROM leases

        JOIN assets

            ON assets.id = leases.asset_id

        JOIN users

            ON users.id = leases.owner_id

        WHERE leases.id = ?

        `,

        [leaseId],

        (err, lease) => {

            if (err) {

                console.error(err);

                return res.send("Failed to load review.");

            }

            if (!lease) {

                return res.send("Lease not found.");

            }

            res.render("review", {

                user: req.session.user,

                lease,

                listing: {

                    id: lease.listing_id,

                    title: lease.title

                },

                reviewee: {

                    id: lease.owner_id,

                    full_name: lease.full_name

                }

            });

        }

    );

};

// ======================================
// Submit Review
// ======================================

exports.createReview = (req, res) => {

    const reviewer_id = req.session.user.id;

    const {

        lease_id,
        reviewee_id,
        rating,
        review

    } = req.body;

    if (!rating) {

        req.session.flash = {

            type: "error",

            message: "Please select a rating."

        };

        return res.redirect(`/reviews/new/${lease_id}`);

    }

    Review.hasReviewed(

        lease_id,

        reviewer_id,

        (err, existing) => {

            if (err) {

                console.error(err);

                return res.send("Server error.");

            }

            if (existing) {

                req.session.flash = {

                    type: "error",

                    message: "You have already reviewed this lease."

                };

                return res.redirect("/dashboard");

            }

            Review.create(

                {

                    lease_id,

                    reviewer_id,

                    reviewed_user_id: reviewee_id,

                    rating,

                    comment: review

                },

                (err) => {

                    if (err) {

                        console.error(err);

                        return res.send("Failed to save review.");

                    }

                    req.session.flash = {

                        type: "success",

                        message: "Review submitted successfully."

                    };

                    res.redirect("/dashboard");

                }

            );

        }

    );

};

// ======================================
// Lease Reviews
// ======================================

exports.getLeaseReviews = (

    leaseId,

    callback

) => {

    Review.getLeaseReviews(

        leaseId,

        (err, reviews) => {

            if (err) {

                console.error(err);

                return callback([]);

            }

            callback(reviews);

        }

    );

};

// ======================================
// User Rating
// ======================================

exports.getUserRating = (

    userId,

    callback

) => {

    Review.getAverageRating(

        userId,

        (err, rating) => {

            if (err) {

                console.error(err);

                return callback({

                    average: 0,

                    total: 0

                });

            }

            callback(

                rating || {

                    average: 0,

                    total: 0

                }

            );

        }

    );

};