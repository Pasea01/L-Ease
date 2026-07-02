const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../client")));

// Sample listing data
const listings = [
    {
        id: 1,
        title: "Luxury Apartment",
        location: "Nairobi",
        price: 3500,
        image: "🏠"
    },
    {
        id: 2,
        title: "Toyota Prado",
        location: "Mombasa",
        price: 8000,
        image: "🚗"
    },
    {
        id: 3,
        title: "Canon EOS R6",
        location: "Kisumu",
        price: 2000,
        image: "📷"
    }
];

// API endpoint
app.get("/api/listings", (req, res) => {
    res.json(listings);
});
// Serve the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 L-ease server running at http://localhost:${PORT}`);
});