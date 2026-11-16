const Listing = require("../models/Listing");
const User = require("../models/User");
const Review = require("../models/Review");

// =====================================
// Home
// =====================================

exports.showHome = (req, res, next) => {

    Listing.getAllListings((err, listings) => {

        if (err) {
            return next(err);

        }

        Review.getHomepageReviews((err, reviews) => {

            if (err) {
                return next(err);

            }

            res.render("index", {

                listings,

                reviews,

                user: req.session.user || null

            });

        });

    });

};

// =====================================
// Dashboard
// =====================================

exports.showDashboard = (req, res, next) => {

    const userId = req.session.user.id;

    User.getDashboardStats(userId, (err, stats) => {

        if (err) {
            return next(err);

        }

        User.getRecentActivity(userId, (err, activities) => {

            if (err) {
                return next(err);

            }

            Review.getAverageRating(userId, (err, rating) => {

                if (err) {
                    return next(err);

                }

                res.render("dashboard", {

                    user: req.session.user,
                    stats,
                    activities,
                    rating

                });

            });

        });

    });

};