const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");

// =====================================
// Home
// =====================================

router.get("/", homeController.showHome);

router.get("/login", authController.showLogin);
router.get("/register", authController.showRegister);

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
    res.render("About", {
        user: req.session.user || null
    });
});

module.exports = router;