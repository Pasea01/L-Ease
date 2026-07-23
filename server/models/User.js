const db = require("../database/db");

class User {

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

    static findByEmail(email, callback) {

        db.get(

            "SELECT * FROM users WHERE email = ?",

            [email],

            callback

        );

    }

    static findById(id, callback) {

        db.get(

            "SELECT * FROM users WHERE id = ?",

            [id],

            callback

        );

    }

    static emailExists(email, userId, callback) {

        const sql = `
            SELECT *
            FROM users
            WHERE email = ?
            AND id != ?
        `;

        db.get(
            sql,
            [email, userId],
            callback
        );

    }

    static getProfileStats(userId, callback) {

        const sql = `
            SELECT
                (SELECT COUNT(*) FROM assets WHERE owner_id = ?) AS listings,
                (SELECT COUNT(*) FROM leases WHERE tenant_id = ?) AS lease_requests,
                (SELECT COUNT(*) FROM leases WHERE owner_id = ? AND status = 'approved') AS successful_leases
        `;

        db.get(
            sql,
            [userId, userId, userId],
            callback
        );

    }

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