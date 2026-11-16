const fs = require("fs");
const path = require("path");
const db = require("./db");

module.exports = () => new Promise((resolve, reject) => {
    const schema = fs.readFileSync(
        path.join(__dirname, "schema.sql"),
        "utf8"
    );

    db.exec(schema, (err) => {
        if (err) {
            return reject(err);
        }

        console.log("✅ Database schema created successfully.");
        resolve();
    });
});

