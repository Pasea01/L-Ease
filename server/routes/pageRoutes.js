const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const homeController = require("../controllers/homeController");

// Home
router.get("/", homeController.showHome);

// Login
router.get("/login", (req, res) => {
    res.render("login");
});

// Register
router.get("/register", (req, res) => {
    res.render("register");
});

// Dashboard
router.get("/dashboard", authMiddleware, (req, res) => {

    res.render("dashboard", {
        user: req.session.user
    });

});

// New Listing
router.get("/listings/new", authMiddleware, (req, res) => {

    res.render("new-listing");

});

module.exports = router;