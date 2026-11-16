const User = require("../models/User");
const Review = require("../models/Review");

// ======================================
// Profile
// ======================================

exports.showProfile = (req, res, next) => {

    const userId = req.session.user.id;

    User.findById(userId, (err, user) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);

        }

        User.getProfileStats(userId, (err, stats) => {

            if (err) {
                return next(err);

            }

            Review.getUserReviews(userId, (err, reviews) => {

                if (err) {
                    return next(err);

                }

                Review.getAverageRating(userId, (err, rating) => {

                    if (err) {
                        return next(err);

                    }

                    res.render("profile", {

                        user,
                        stats,
                        reviews,
                        rating

                    });

                });

            });

        });

    });

};

// ======================================
// Reviews Page
// ======================================

exports.showReviews = (req, res, next) => {

    const userId = req.session.user.id;

    User.findById(userId, (err, user) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);

        }

        Review.getUserReviews(userId, (err, reviews) => {

            if (err) {
                return next(err);

            }

            Review.getAverageRating(userId, (err, rating) => {

                if (err) {
                    return next(err);

                }

                res.render("reviews", {

                    user,
                    reviews,
                    rating

                });

            });

        });

    });

};

// ======================================
// Edit Profile
// ======================================

exports.showEditProfile = (req, res, next) => {

    User.findById(req.session.user.id, (err, user) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);

        }

        res.render("edit-profile", {

            user

        });

    });

};

// ======================================
// Update Profile
// ======================================

exports.updateProfile = (req, res, next) => {

    const userId = req.session.user.id;
    const fullName = typeof req.body.full_name === "string"
        ? req.body.full_name.trim()
        : "";
    const email = typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const phone = typeof req.body.phone === "string"
        ? req.body.phone.trim()
        : "";

    const user = {

        full_name: fullName,
        email,
        phone,

        profile_image: req.file
            ? req.file.filename
            : null

    };

    if (
        fullName.length < 2
        || fullName.length > 80
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        || email.length > 254
        || (phone.length > 0 && phone.length < 7)
        || phone.length > 20
    ) {
        req.session.flash = {
            type: "error",
            message: "Enter a valid name, email address, and phone number."
        };
        return res.redirect("/profile/edit");
    }

    User.emailExists(user.email, userId, (err, existingUser) => {

        if (err) {
            return next(err);

        }

        if (existingUser) {

            req.session.flash = {

                type: "error",

                message: "That email address is already in use."

            };

            return res.redirect("/profile/edit");

        }

        User.updateProfile(userId, user, (err) => {

            if (err) {
                return next(err);

            }

            req.session.user.full_name = user.full_name;
            req.session.user.email = user.email;

                if (user.profile_image) {

                    req.session.user.profile_image = user.profile_image;

                }

            req.session.flash = {

                type: "success",

                message: "Profile updated successfully."

            };

            res.redirect("/profile");

        });

    });

};