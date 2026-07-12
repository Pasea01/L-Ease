const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showRegister = (req, res) => {

    res.render("register");

};

exports.register = async (req, res) => {

    try {

        const {

            full_name,
            email,
            phone,
            password

        } = req.body;

        const existingUser = await new Promise((resolve, reject) => {

            User.findByEmail(email, (err, user) => {

                if (err) reject(err);

                resolve(user);

            });

        });

        if (existingUser) {

            return res.send("Email already exists.");

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        User.create({

            full_name,

            email,

            phone,

            password: hashedPassword

        }, (err) => {

            if (err) {

                return res.send("Registration failed.");

            }

            res.redirect("/login");

        });

    }

    catch (error) {

        console.error(error);

        res.send("Server error.");

    }

};
exports.showLogin = (req, res) => {
    res.render("login");
};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        User.findByEmail(email, async (err, user) => {

            if (err) {
                return res.send("Server error.");
            }

            if (!user) {
                return res.send("Invalid email or password.");
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.send("Invalid email or password.");
            }

            req.session.user = {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            };

            res.redirect("/dashboard");

        });

    } catch (error) {

        console.error(error);

        res.send("Server error.");

    }

};

exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

};