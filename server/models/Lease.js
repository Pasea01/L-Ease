const db = require("../database/db");

class Lease {

    static create(lease, callback) {

        const sql = `
            INSERT INTO leases
            (
                asset_id,
                owner_id,
                tenant_id,
                start_date,
                end_date,
                message
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                lease.asset_id,
                lease.owner_id,
                lease.tenant_id,
                lease.start_date,
                lease.end_date,
                lease.message
            ],
            callback
        );

    }

    static getOwnerRequests(ownerId, callback) {

    const sql = `
        SELECT
            leases.*,
            assets.title,
            users.full_name AS tenant_name
        FROM leases
        JOIN assets
            ON leases.asset_id = assets.id
        JOIN users
            ON leases.tenant_id = users.id
        WHERE leases.owner_id = ?
        ORDER BY leases.created_at DESC
    `;

    db.all(sql, [ownerId], callback);

}

// Approve lease request
static approve(id, ownerId, callback) {

    const sql = `
        UPDATE leases
        SET status = 'approved'
        WHERE id = ?
        AND owner_id = ?
    `;

    db.run(sql, [id, ownerId], callback);

}

// Reject lease request
static reject(id, ownerId, callback) {

    const sql = `
        UPDATE leases
        SET status = 'cancelled'
        WHERE id = ?
        AND owner_id = ?
    `;

    db.run(sql, [id, ownerId], callback);

}

}


module.exports = Lease;