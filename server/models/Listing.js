const db = require("../database/db");

class Listing {

    // Get all listings
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

    // Search listings
    static search(filters, callback) {

        let sql = `
            SELECT assets.*, users.full_name
            FROM assets
            JOIN users
            ON assets.owner_id = users.id
            WHERE 1 = 1
        `;

        const params = [];

        if (filters.search) {

            sql += `
                AND (
                    assets.title LIKE ?
                    OR assets.description LIKE ?
                )
            `;

            params.push(`%${filters.search}%`);
            params.push(`%${filters.search}%`);
        }

        if (filters.category) {

            sql += `
                AND assets.category = ?
            `;

            params.push(filters.category);
        }

        if (filters.location) {

            sql += `
                AND assets.location LIKE ?
            `;

            params.push(`%${filters.location}%`);
        }

        if (filters.minPrice) {

            sql += `
                AND assets.price_per_day >= ?
            `;

            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {

            sql += `
                AND assets.price_per_day <= ?
            `;

            params.push(filters.maxPrice);
        }

        switch (filters.sort) {

            case "oldest":
                sql += " ORDER BY assets.created_at ASC";
                break;

            case "price-low":
                sql += " ORDER BY assets.price_per_day ASC";
                break;

            case "price-high":
                sql += " ORDER BY assets.price_per_day DESC";
                break;

            default:
                sql += " ORDER BY assets.created_at DESC";
        }

        db.all(sql, params, callback);

    }
    
    // Get listings for one user
    static getUserListings(ownerId, callback) {

        const sql = `
            SELECT *
            FROM assets
            WHERE owner_id = ?
            ORDER BY created_at DESC
        `;

        db.all(sql, [ownerId], callback);

    }

    // Create listing
    static create(listing, callback) {

        const sql = `
            INSERT INTO assets
            (
                owner_id,
                title,
                description,
                category,
                price_per_day,
                location,
                image_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                listing.owner_id,
                listing.title,
                listing.description,
                listing.category,
                listing.price_per_day,
                listing.location,
                listing.image_url
            ],
            callback
        );

    }

    // Delete listing
    static deleteListing(id, ownerId, callback) {

        const sql = `
            DELETE FROM assets
            WHERE id = ?
            AND owner_id = ?
        `;

        db.run(sql, [id, ownerId], callback);

    }

    // Get one listing
static getById(id, ownerId, callback) {

    const sql = `
        SELECT *
        FROM assets
        WHERE id = ?
        AND owner_id = ?
    `;

    db.get(sql, [id, ownerId], callback);

}

// Update listing
static update(id, ownerId, listing, callback) {

    const sql = `
        UPDATE assets
        SET
            title = ?,
            description = ?,
            category = ?,
            price_per_day = ?,
            location = ?,
            image_url = ?
        WHERE
            id = ?
        AND
            owner_id = ?
    `;

    db.run(
        sql,
        [
            listing.title,
            listing.description,
            listing.category,
            listing.price_per_day,
            listing.location,
            listing.image_url,
            id,
            ownerId
        ],
        callback
    );

}
// Get one listing by ID
static getListingById(id, callback) {

    const sql = `
        SELECT assets.*, users.full_name
        FROM assets
        JOIN users
        ON assets.owner_id = users.id
        WHERE assets.id = ?
    `;

    db.get(sql, [id], callback);

}

}


module.exports = Listing;