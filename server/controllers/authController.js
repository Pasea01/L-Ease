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