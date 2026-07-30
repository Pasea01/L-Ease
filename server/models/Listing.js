const db = require("../database/db");

class Listing {

    // =====================================
    // Get all listings
    // =====================================

    static getAllListings(callback) {

        const sql = `

            SELECT

                assets.*,

                users.full_name,

                ROUND(AVG(reviews.rating),1) AS average_rating,

                COUNT(reviews.id) AS review_count

            FROM assets

            JOIN users

                ON assets.owner_id = users.id

            LEFT JOIN leases

                ON leases.asset_id = assets.id

            LEFT JOIN reviews

                ON reviews.lease_id = leases.id

            GROUP BY assets.id

            ORDER BY assets.created_at DESC

        `;

        db.all(sql, [], callback);

    }

    // =====================================
    // Search Listings
    // =====================================

    static search(filters, callback) {

        let sql = `

            SELECT

                assets.*,

                users.full_name,

                ROUND(AVG(reviews.rating),1) AS average_rating,

                COUNT(reviews.id) AS review_count

            FROM assets

            JOIN users

                ON assets.owner_id = users.id

            LEFT JOIN leases

                ON leases.asset_id = assets.id

            LEFT JOIN reviews

                ON reviews.lease_id = leases.id

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

        sql += `

            GROUP BY assets.id

        `;

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

    // =====================================
    // User Listings
    // =====================================

    static getUserListings(ownerId, callback) {

        const sql = `

            SELECT

                assets.*,

                ROUND(AVG(reviews.rating),1) AS average_rating,

                COUNT(DISTINCT reviews.id) AS review_count,

                COUNT(

                    DISTINCT CASE

                        WHEN leases.status = 'completed'
                        THEN leases.id

                    END

                ) AS completed_leases,

                COUNT(

                    DISTINCT CASE

                        WHEN leases.status = 'pending'

                        THEN leases.id

                    END

                ) AS pending_requests

            FROM assets

            LEFT JOIN leases

                ON leases.asset_id = assets.id

            LEFT JOIN reviews

                ON reviews.lease_id = leases.id

            WHERE assets.owner_id = ?

            GROUP BY assets.id

            ORDER BY assets.created_at DESC

        `;

        db.all(sql, [ownerId], callback);

    }

    // =====================================
    // Create Listing
    // =====================================

    static create(listing, callback) {

        db.run(

            `

            INSERT INTO assets(

                owner_id,

                title,

                description,

                category,

                price_per_day,

                location,

                image_url

            )

            VALUES (?, ?, ?, ?, ?, ?, ?)

            `,

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

    // =====================================
    // Delete Listing
    // =====================================

    static deleteListing(id, ownerId, callback) {

        db.run(

            `

            DELETE FROM assets

            WHERE id = ?

            AND owner_id = ?

            `,

            [

                id,

                ownerId

            ],

            callback

        );

    }

    // =====================================
    // Owner Edit Listing
    // =====================================

    static getById(id, ownerId, callback) {

        db.get(

            `

            SELECT *

            FROM assets

            WHERE id = ?

            AND owner_id = ?

            `,

            [

                id,

                ownerId

            ],

            callback

        );

    }

    // =====================================
    // Update Listing
    // =====================================

    static update(id, ownerId, listing, callback) {

        db.run(

            `

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

            AND owner_id = ?

            `,

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

    // =====================================
    // Listing Details
    // =====================================

    static getListingById(id, callback) {

        db.get(

            `

            SELECT

                assets.*,

                users.full_name

            FROM assets

            JOIN users

                ON assets.owner_id = users.id

            WHERE assets.id = ?

            `,

            [

                id

            ],

            callback

        );

    }

    // =====================================
    // Listing Reviews
    // =====================================

    static getListingReviews(assetId, callback) {

        db.all(

            `

            SELECT

                reviews.rating,

                reviews.comment,

                reviews.created_at,

                users.full_name

            FROM reviews

            JOIN leases

                ON leases.id = reviews.lease_id

            JOIN users

                ON users.id = reviews.reviewer_id

            WHERE leases.asset_id = ?

            ORDER BY reviews.created_at DESC

            `,

            [

                assetId

            ],

            callback

        );

    }

    // =====================================
    // Listing Rating
    // =====================================

    static getListingRating(assetId, callback) {

        db.get(

            `

            SELECT

                ROUND(AVG(reviews.rating),1) AS average,

                COUNT(reviews.id) AS total

            FROM leases

            LEFT JOIN reviews

                ON reviews.lease_id = leases.id

            WHERE leases.asset_id = ?

            `,

            [

                assetId

            ],

            callback

        );

    }

}

module.exports = Listing;