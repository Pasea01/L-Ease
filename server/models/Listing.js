const db = require("../database/db");

class Listing {

    static getAllListings(callback) {

        const sql = `
            SELECT assets.*, users.full_name
            FROM assets
            JOIN users
            ON assets.owner_id = users.id
            ORDER BY assets.created_at DESC
        `;

        db.all(sql, [], callback);

    }

    static create(listing, callback) {

        const sql = `
            INSERT INTO assets
            (
                owner_id,
                title,
                description,
                category,
                price_per_day,
                location
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                listing.owner_id,
                listing.title,
                listing.description,
                listing.category,
                listing.price_per_day,
                listing.location
            ],
            callback
        );

    }

}

module.exports = Listing;