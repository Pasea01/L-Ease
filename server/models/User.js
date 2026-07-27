const db = require("../database/db");

class User {

    // ======================================
    // Create User
    // ======================================

    static create(user, callback) {

        const sql = `
            INSERT INTO users
            (full_name, email, password, phone)
            VALUES (?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                user.full_name,
                user.email,
                user.password,
                user.phone
            ],
            function (err) {

                callback(err, this?.lastID);

            }
        );

    }

    // ======================================

    static findByEmail(email, callback) {

        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            callback
        );

    }

    // ======================================

    static findById(id, callback) {

        db.get(
            "SELECT * FROM users WHERE id = ?",
            [id],
            callback
        );

    }

    // ======================================

    static emailExists(email, userId, callback) {

        const sql = `
            SELECT *
            FROM users
            WHERE email = ?
            AND id != ?
        `;

        db.get(sql, [email, userId], callback);

    }

    // ======================================
    // Profile Stats
    // ======================================

    static getProfileStats(userId, callback) {

        const sql = `
            SELECT
                (SELECT COUNT(*) FROM assets WHERE owner_id = ?) AS listings,
                (SELECT COUNT(*) FROM leases WHERE tenant_id = ?) AS lease_requests,
                (SELECT COUNT(*) FROM leases WHERE owner_id = ? AND status='approved') AS successful_leases
        `;

        db.get(sql, [userId, userId, userId], callback);

    }

    // ======================================
    // Dashboard Stats
    // ======================================

    static getDashboardStats(userId, callback) {

        const sql = `

            SELECT

            (
                SELECT COUNT(*)
                FROM assets
                WHERE owner_id = ?
            ) AS listings,

            (
                SELECT COUNT(*)
                FROM leases
                WHERE owner_id = ?
                AND status='pending'
            ) AS requests,

            (
                SELECT COUNT(*)
                FROM messages
                WHERE receiver_id = ?
                AND is_read = 0
            ) AS messages,

            (
                SELECT COUNT(*)
                FROM reviews
                WHERE reviewed_user_id = ?
            ) AS reviews

        `;

        db.get(

            sql,

            [

                userId,
                userId,
                userId,
                userId

            ],

            callback

        );

    }

    // ======================================
    // Dashboard Activity
    // ======================================

    static getRecentActivity(userId, callback) {

        const sql = `

            SELECT *

            FROM (

                SELECT

                    assets.created_at,

                    'listing' AS type,

                    assets.title AS asset,

                    'You listed "' || assets.title || '"' AS description,

                    NULL AS other_user

                FROM assets

                WHERE owner_id = ?

                UNION ALL

                SELECT

                    leases.created_at,

                    'lease',

                    assets.title,

                    users.full_name || ' requested "' || assets.title || '"' AS description,

                    users.full_name

                FROM leases

                JOIN users
                    ON users.id = leases.tenant_id

                JOIN assets
                    ON assets.id = leases.asset_id

                WHERE leases.owner_id = ?

                UNION ALL

                SELECT

                    messages.created_at,

                    'message',

                    assets.title,

                    users.full_name || ' sent you a message about "' || assets.title || '"' AS description,

                    users.full_name

                FROM messages

                JOIN users
                    ON users.id = messages.sender_id

                LEFT JOIN assets
                    ON assets.id = messages.asset_id

                WHERE messages.receiver_id = ?

                UNION ALL

                SELECT

                    reviews.created_at,

                    'review',

                    assets.title,

                    users.full_name || ' rated you ' ||
                    reviews.rating ||
                    '⭐' AS description,

                    users.full_name

                FROM reviews

                JOIN users
                    ON users.id = reviews.reviewer_id

                LEFT JOIN leases
                    ON leases.id = reviews.lease_id

                LEFT JOIN assets
                    ON assets.id = leases.asset_id

                WHERE reviews.reviewed_user_id = ?

                UNION ALL

                SELECT

                    leases.updated_at,

                    'completed',

                    assets.title,

                    '"' || assets.title || '" lease completed' AS description,

                    NULL

                FROM leases

                JOIN assets
                    ON assets.id = leases.asset_id

                WHERE leases.owner_id = ?

                AND leases.status='completed'

            )

            ORDER BY created_at DESC

            LIMIT 10

            `;

        db.all(

            sql,

            [

                userId,
                userId,
                userId,
                userId,
                userId

            ],

            callback

        );

    }

    // ======================================

    static updateProfile(userId, user, callback) {

        const sql = `
            UPDATE users
            SET
                full_name = ?,
                email = ?,
                phone = ?
            WHERE id = ?
        `;

        db.run(
            sql,
            [
                user.full_name,
                user.email,
                user.phone,
                userId
            ],
            callback
        );

    }

}

module.exports = User;