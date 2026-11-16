const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showRegister = (req, res) => {

    res.render("register");

};

exports.register = async (req, res, next) => {

    try {

        const full_name = typeof req.body.full_name === "string"
            ? req.body.full_name.trim()
            : "";
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";
        const phone = typeof req.body.phone === "string"
            ? req.body.phone.trim()
            : "";
        const password = typeof req.body.password === "string"
            ? req.body.password
            : "";

        if (
            full_name.length < 2
            || full_name.length > 80
            || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            || email.length > 254
            || phone.length < 7
            || phone.length > 20
            || password.length < 8
            || Buffer.byteLength(password, "utf8") > 72
        ) {
            req.session.flash = {
                type: "error",
                message: "Enter a valid name, email and phone number, and use a password of at least 8 characters."
            };
            return res.redirect("/register");
        }

        const existingUser = await new Promise((resolve, reject) => {

            User.findByEmail(email, (err, user) => {

                if (err) {
                    return reject(err);
                }

                resolve(user);

            });

        });

        if (existingUser) {

            req.session.flash = {
                type: "error",
                message: "An account with that email already exists."
            };
            return res.redirect("/register");

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        User.create({

            full_name,

            email,

            phone,

            password: hashedPassword

        }, (err) => {

            if (err) {

                return next(err);

            }

            res.redirect("/login");

        });

    }

    catch (error) {

        next(error);

    }

};
exports.showLogin = (req, res) => {
    res.render("login");
};

exports.login = async (req, res, next) => {

    try {

        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";
        const password = typeof req.body.password === "string"
            ? req.body.password
            : "";

        if (!email || !password) {
            req.session.flash = {
                type: "error",
                message: "Invalid email or password."
            };
            return res.redirect("/login");
        }

        User.findByEmail(email, (err, user) => {

            if (err) {
                return next(err);
            }

            if (!user) {
                req.session.flash = {
                    type: "error",
                    message: "Invalid email or password."
                };
                return res.redirect("/login");
            }

            bcrypt.compare(password, user.password)
                .then((match) => {
                    if (!match) {
                        req.session.flash = {
                            type: "error",
                            message: "Invalid email or password."
                        };
                        return res.redirect("/login");
                    }

                    req.session.regenerate((sessionError) => {
                        if (sessionError) {
                            return next(sessionError);
                        }

                        req.session.user = {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            profile_image: user.profile_image,
                            role: user.role
                        };

                        req.session.save((saveError) => {
                            if (saveError) {
                                return next(saveError);
                            }
                            res.redirect("/dashboard");
                        });
                    });
                })
                .catch(next);

        });

    } catch (error) {

        next(error);

    }

};

exports.logout = (req, res, next) => {

    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/");

    });

};