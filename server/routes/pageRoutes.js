const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const homeController = require("../controllers/homeController");

// =====================================
// Home
// =====================================

router.get("/", homeController.showHome);

// =====================================
// Login
// =====================================

router.get("/login", (req, res) => {

    res.render("login");

});

// =====================================
// Register
// =====================================

router.get("/register", (req, res) => {

    res.render("register");

});

// =====================================
// Dashboard
// =====================================

router.get(

    "/dashboard",

    authMiddleware,

    homeController.showDashboard

);

// =====================================
// New Listing
// =====================================

router.get(

    "/listings/new",

    authMiddleware,

    (req, res) => {

        res.render("new-listing");

    }

);

router.get("/about", (req, res) => {
    res.render("about", {
        user: req.session.user || null
    });
});

module.exports = router;