const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Home page
router.get("/", (req, res) => {
    res.render("index");
});

// Login page
router.get("/login", (req, res) => {
    res.render("login");
});

// Register page
router.get("/register", (req, res) => {
    res.render("register");
});

// Dashboard
router.get("/dashboard", authMiddleware, (req, res) => {
    res.render("dashboard", {
        user: req.session.user
    });
});

module.exports = router;

router.get("/listings/new", authMiddleware, (req, res) => {
    res.render("new-listing");
});