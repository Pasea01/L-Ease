require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const session = require("express-session");
const leaseRoutes = require("./routes/leaseRoutes");
const messageRoutes = require("./routes/messageRoutes");

require("./database/db");
require("./database/initDatabase");

const pageRoutes = require("./routes/pageRoutes");
const listingRoutes = require("./routes/listingRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

const getCategoryImage = require("./helpers/categoryImage");

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
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.use((req, res, next) => {

    res.locals.user = req.session.user || null;

    res.locals.getCategoryImage = getCategoryImage;

    next();

});

// --------------------------
// Routes
// --------------------------

app.use("/", pageRoutes);

// JSON API
app.get(
    "/api/listings",
    require("./controllers/listingController").getListingsAPI
);

// Website
app.use("/listings", listingRoutes);

app.use("/auth", authRoutes);

app.use("/leases", leaseRoutes);

app.use("/messages", messageRoutes);

// --------------------------
// Start Server
// --------------------------

app.listen(PORT, () => {
    console.log(`🚀 L-ease running on http://localhost:${PORT}`);
});