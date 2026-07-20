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

    static getTenantRequests(tenantId, callback) {

    const sql = `
        SELECT
            leases.*,
            assets.title,
            assets.category,
            assets.image_url,
            users.full_name AS owner_name
        FROM leases

        JOIN assets
            ON leases.asset_id = assets.id

        JOIN users
            ON leases.owner_id = users.id

        WHERE leases.tenant_id = ?

        ORDER BY leases.created_at DESC
    `;

    db.all(sql, [tenantId], callback);

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

// Get one lease by ID
static getById(id, callback) {

    const sql = `
        SELECT *
        FROM leases
        WHERE id = ?
    `;

    db.get(sql, [id], callback);

}

}


module.exports = Lease;