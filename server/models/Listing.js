const db = require("../database/db");

function getAllListings(callback) {

    db.all(
        "SELECT * FROM assets",
        [],
        (err, rows) => {

            callback(err, rows);

        }
    );

}

module.exports = {

    getAllListings

};