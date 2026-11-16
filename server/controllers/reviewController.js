const Review = require("../models/Review");
const Lease = require("../models/Lease");
const Notification = require("../models/Notification");
const db = require("../database/db");

// ======================================
// Review Form
// ======================================

exports.showReviewForm = (req, res, next) => {

    const leaseId = Number(req.params.leaseId);

    if (!Number.isSafeInteger(leaseId) || leaseId < 1) {
        const error = new Error("Lease not found.");
        error.status = 404;
        return next(error);
    }

    db.get(

        `

        SELECT

            leases.*,

            assets.title,

            owner.full_name AS owner_name,

            tenant.full_name AS tenant_name

        FROM leases

        JOIN assets

            ON assets.id = leases.asset_id

        JOIN users owner

            ON owner.id = leases.owner_id

        JOIN users tenant

            ON tenant.id = leases.tenant_id

        WHERE leases.id = ?

        `,

        [leaseId],

        (err, lease) => {

            if (err) {
                return next(err);

            }

            if (!lease) {
                const error = new Error("Lease not found.");
                error.status = 404;
                return next(error);

            }

            const userId = req.session.user.id;
            const isParticipant = Number(lease.tenant_id) === userId
                || Number(lease.owner_id) === userId;

            if (lease.status !== "completed" || !isParticipant) {
                const error = new Error("You can only review someone from a completed lease.");
                error.status = 403;
                return next(error);
            }

            Review.hasReviewed(leaseId, req.session.user.id, (err, existingReview) => {
                if (err) {
                    return next(err);
                }

                if (existingReview) {
                    req.session.flash = {
                        type: "error",
                        message: "You have already reviewed this lease."
                    };
                    return res.redirect("/leases/my-requests");
                }

                res.render("review-form", {
                    user: req.session.user,
                    lease,
                    listing: {
                        id: lease.asset_id,
                        title: lease.title
                    },
                    reviewee: {
                        id: Number(lease.owner_id) === userId
                            ? lease.tenant_id
                            : lease.owner_id,
                        full_name: Number(lease.owner_id) === userId
                            ? lease.tenant_name
                            : lease.owner_name
                    }
                });
            });

        }

    );

};

// ======================================
// Submit Review
// ======================================

exports.createReview = (req, res, next) => {

    const reviewerId = req.session.user.id;
    const leaseId = Number(req.body.lease_id);
    const rating = Number(req.body.rating);
    const comment = typeof req.body.review === "string"
        ? req.body.review.trim()
        : "";

    if (
        !Number.isSafeInteger(leaseId)
        || leaseId < 1
        || !Number.isInteger(rating)
        || rating < 1
        || rating > 5
        || !comment
        || comment.length > 1000
    ) {
        req.session.flash = {
            type: "error",
            message: "Please provide a rating from 1 to 5 and a review under 1,000 characters."
        };
        return res.redirect(
            Number.isSafeInteger(leaseId) && leaseId > 0
                ? `/reviews/new/${leaseId}`
                : "/leases/my-requests"
        );
    }

    Lease.getById(leaseId, (err, lease) => {
        if (err) {
            return next(err);
        }

        if (!lease) {
            const error = new Error("Lease not found.");
            error.status = 404;
            return next(error);
        }

        const isOwner = Number(lease.owner_id) === reviewerId;
        const isTenant = Number(lease.tenant_id) === reviewerId;

        if (lease.status !== "completed" || (!isOwner && !isTenant)) {
            const error = new Error("You can only review someone from a completed lease.");
            error.status = 403;
            return next(error);
        }

        const revieweeId = isOwner ? lease.tenant_id : lease.owner_id;

        Review.hasReviewed(leaseId, reviewerId, (err, existingReview) => {
            if (err) {
                return next(err);
            }

            if (existingReview) {
                req.session.flash = {
                    type: "error",
                    message: "You have already reviewed this lease."
                };
                return res.redirect("/leases/my-requests");
            }

            Review.create(
                {
                    lease_id: leaseId,
                    reviewer_id: reviewerId,
                    reviewed_user_id: revieweeId,
                    rating,
                    comment
                },
                (err, changes) => {
                    if (err) {
                        if (err.code === "SQLITE_CONSTRAINT") {
                            req.session.flash = {
                                type: "error",
                                message: "This review could not be submitted. Please check the lease and try again."
                            };
                            return res.redirect(`/reviews/new/${leaseId}`);
                        }
                        return next(err);
                    }

                    if (!changes) {
                        req.session.flash = {
                            type: "error",
                            message: "You have already reviewed this lease."
                        };
                        return res.redirect("/leases/my-requests");
                    }

                    Notification.create(
                        {
                            user_id: revieweeId,
                            title: "New Review",
                            message: `${req.session.user.full_name} left you a ${rating}-star review.`,
                            link: "/profile"
                        },
                        (notificationError) => {
                            req.session.flash = notificationError
                                ? {
                                    type: "error",
                                    message: "Your review was submitted, but we couldn't notify the owner."
                                }
                                : {
                                    type: "success",
                                    message: "Thank you! Your review has been submitted."
                                };
                            res.redirect("/dashboard");
                        }
                    );
                }
            );
        });
    });

};

// ======================================

exports.getLeaseReviews = (leaseId, callback) => {

    Review.getLeaseReviews(

        leaseId,

        (err, reviews) => {

            if (err) {
                return callback(err);

            }

            callback(null, reviews);

        }

    );

};

// ======================================

exports.getOwnerRating = (ownerId, callback) => {

    Review.getAverageRating(

        ownerId,

        (err, rating) => {

            if (err) {
                return callback(err);

            }

            callback(null, rating);

        }

    );

};