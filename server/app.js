require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const leaseRoutes = require("./routes/leaseRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const pageRoutes = require("./routes/pageRoutes");
const listingRoutes = require("./routes/listingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const notificationMiddleware = require("./middleware/notificationMiddleware");

require("./database/db");
require("./database/initDatabase");

const getCategoryImage = require("./helpers/categoryImage");

const getProfileImage = require("./helpers/profileImage");
const getListingImage = require("./helpers/listingImage");

const app = express();

const PORT = process.env.PORT || 3000;

// --------------------------
// View Engine
// --------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

// --------------------------
// Middleware
// --------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../src/public")));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "../src/uploads"))
);

app.use(

    session({

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {

            maxAge: 1000 * 60 * 60 * 24 * 7

        }

    })

);

// Global template variables

app.use((req, res, next) => {

    res.locals.user = req.session.user || null;

    res.locals.flash = req.session.flash || null;

    res.locals.getCategoryImage = getCategoryImage;

    res.locals.getProfileImage = getProfileImage;

    res.locals.getListingImage = getListingImage;

    delete req.session.flash;

    next();

});

// Notifications

app.use(notificationMiddleware);

// --------------------------
// Routes
// --------------------------

app.use("/", pageRoutes);

app.get(

    "/api/listings",

    require("./controllers/listingController").getListingsAPI

);

app.use("/listings", listingRoutes);

app.use("/auth", authRoutes);

app.use("/leases", leaseRoutes);

app.use("/messages", messageRoutes);

app.use("/reviews", reviewRoutes);

app.use("/notifications", notificationRoutes);

app.use("/", userRoutes);

// --------------------------
// Start Server
// --------------------------

app.listen(PORT, () => {

    console.log(`🚀 L-Ease running on http://localhost:${PORT}`);

});