require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");

const authRoutes = require("./routes/authRoutes");
const leaseRoutes = require("./routes/leaseRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const pageRoutes = require("./routes/pageRoutes");
const listingRoutes = require("./routes/listingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const notificationMiddleware = require("./middleware/notificationMiddleware");
const errorHandler = require("./middleware/errorHandler");

require("./database/db");
const initializeDatabase = require("./database/initDatabase");

const getCategoryImage = require("./helpers/categoryImage");

const getProfileImage = require("./helpers/profileImage");
const getListingImage = require("./helpers/listingImage");

const app = express();

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set in production.");
}

if (isProduction) {
    app.set("trust proxy", 1);
}

// --------------------------
// View Engine
// --------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

// --------------------------
// Middleware
// --------------------------

app.use(

    session({

        secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../src/public")));

app.use(

    "/uploads",

    express.static(path.join(__dirname, "../src/uploads"))

);

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

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use(errorHandler);

// --------------------------
// Start Server
// --------------------------

if (require.main === module) {

    initializeDatabase()
        .then(() => app.listen(PORT, () => {

            console.log(`🚀 L-Ease running on http://localhost:${PORT}`);

        }))
        .catch((error) => {
            console.error("Database initialization failed:", error);
            process.exitCode = 1;
        });

}

module.exports = app;