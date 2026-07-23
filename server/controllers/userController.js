const User = require("../models/User");

exports.showProfile = (req, res) => {

    const userId = req.session.user.id;

    User.findById(userId, (err, user) => {

        if (err || !user) {

            console.error(err);

            return res.send("Failed to load profile.");

        }

        User.getProfileStats(userId, (err, stats) => {

            if (err) {

                console.error(err);

                return res.send("Failed to load profile.");

            }

            res.render("profile", {

                user,
                stats

            });

        });

    });

};

exports.showEditProfile = (req, res) => {

    User.findById(req.session.user.id, (err, user) => {

        if (err || !user) {

            return res.send("User not found.");

        }

        res.render("edit-profile", {

            user

        });

    });

};

exports.updateProfile = (req, res) => {

    const userId = req.session.user.id;

    const user = {

        full_name: req.body.full_name,
        email: req.body.email,
        phone: req.body.phone

    };

    User.emailExists(user.email, userId, (err, existingUser) => {

    if (err) {

        console.error(err);
        return res.send("Database error.");

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

                console.error(err);

                return res.send("Failed to update profile.");

            }

            req.session.user.full_name = user.full_name;
            req.session.user.email = user.email;

            req.session.flash = {

                type: "success",
                message: "Profile updated successfully."

            };

            res.redirect("/profile");

        });

    });

};