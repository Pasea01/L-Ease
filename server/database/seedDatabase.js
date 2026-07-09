const fs = require("fs");
const path = require("path");
const db = require("./db");

const seed = fs.readFileSync(
    path.join(__dirname, "seed.sql"),
    "utf8"
);

db.exec(seed, (err) => {

    if (err) {

        console.error("Seed failed:", err.message);

    } else {

        console.log("✅ Sample data inserted.");

    }

});