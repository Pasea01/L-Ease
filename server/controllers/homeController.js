const Listing = require("../models/Listing");
const User = require("../models/User");
const Review = require("../models/Review");

// =====================================
// Home
// =====================================

exports.showHome = (req, res) => {

    Listing.getAllListings((err, listings) => {

        if (err) {

            console.error(err);

            listings = [];

        }

        Review.getHomepageReviews((err, reviews) => {

            if (err) {

                console.error(err);

                reviews = [];

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

exports.showDashboard = (req, res) => {

    const userId = req.session.user.id;

    User.getDashboardStats(userId, (err, stats) => {

        if (err) {

            console.error(err);

            return res.send("Failed to load dashboard.");

        }

        User.getRecentActivity(userId, (err, activities) => {

            if (err) {

                console.error(err);

                return res.send("Failed to load dashboard.");

            }

            Review.getAverageRating(userId, (err, rating) => {

                if (err) {

                    console.error(err);

                    return res.send("Failed to load dashboard.");

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