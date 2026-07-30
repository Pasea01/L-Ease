const Review = require("../models/Review");
const Lease = require("../models/Lease");
const Notification = require("../models/Notification");
const db = require("../database/db");

// ======================================
// Review Form
// ======================================

exports.showReviewForm = (req, res) => {

    const leaseId = req.params.leaseId;

    db.get(

        `

        SELECT

            leases.*,

            assets.title,

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

            res.render("review-form", {

                user: req.session.user,

                lease,

                listing: {

                    id: lease.asset_id,

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

                    Lease.getById(

                        lease_id,

                        (err, lease) => {

                            if (!err && lease) {

                                db.get(

                                    `

                                    SELECT title

                                    FROM assets

                                    WHERE id = ?

                                    `,

                                    [lease.asset_id],

                                    (err, asset) => {

                                        Notification.create(

                                            {

                                                user_id: reviewee_id,

                                                title: "New Review",

                                                message: `${req.session.user.full_name} left you a ${rating}-star review for "${asset.title}".`,

                                                link: "/profile"

                                            },

                                            () => {}

                                        );

                                    }

                                );

                            }

                        }

                    );

                    req.session.flash = {

                        type: "success",

                        message: "Thank you! Your review has been submitted."

                    };

                    res.redirect("/dashboard");

                }

            );

        }

    );

};

// ======================================

exports.getLeaseReviews = (leaseId, callback) => {

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

exports.getOwnerRating = (ownerId, callback) => {

    Review.getAverageRating(

        ownerId,

        (err, rating) => {

            if (err) {

                console.error(err);

                return callback({

                    average: 0,

                    total: 0

                });

            }

            callback(rating);

        }

    );

};