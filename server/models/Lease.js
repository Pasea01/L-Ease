const db = require("../database/db");

class Lease {

    // =====================================
    // Create Lease Request
    // =====================================
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

    // =====================================
    // Requests received by the owner
    // =====================================
    static getOwnerRequests(ownerId, callback) {

        const sql = `
            SELECT
                leases.*,
                assets.title,
                assets.category,
                assets.image_url,
                users.full_name AS tenant_name,
                EXISTS (
                    SELECT 1
                    FROM reviews
                    WHERE reviews.lease_id = leases.id
                    AND reviews.reviewer_id = leases.owner_id
                ) AS has_reviewed
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

    // =====================================
    // Requests made by the tenant
    // =====================================
    static getTenantRequests(tenantId, callback) {

        const sql = `
            SELECT
                leases.*,
                assets.title,
                assets.category,
                assets.image_url,
                users.full_name AS owner_name,
                EXISTS (
                    SELECT 1
                    FROM reviews
                    WHERE reviews.lease_id = leases.id
                    AND reviews.reviewer_id = leases.tenant_id
                ) AS has_reviewed
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

    // =====================================
    // Approve Lease
    // =====================================
    static approve(id, ownerId, callback) {

        const sql = `
            UPDATE leases
            SET
                status = 'approved',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND owner_id = ?
            AND status = 'pending'
            AND NOT EXISTS (
                SELECT 1
                FROM leases existing
                WHERE existing.asset_id = leases.asset_id
                AND existing.id != leases.id
                AND existing.status IN ('approved', 'active')
                AND existing.start_date <= leases.end_date
                AND existing.end_date >= leases.start_date
            )
        `;

        db.run(sql, [id, ownerId], function (err) {
            callback(err, this.changes);
        });

    }

    // =====================================
    // Reject Lease
    // =====================================
    static reject(id, ownerId, callback) {

        const sql = `
            UPDATE leases
            SET
                status = 'cancelled',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND owner_id = ?
            AND status = 'pending'
        `;

        db.run(sql, [id, ownerId], function (err) {
            callback(err, this.changes);
        });

    }

    // =====================================
    // Get Lease by ID
    // =====================================
    static getById(id, callback) {

        const sql = `
            SELECT *
            FROM leases
            WHERE id = ?
        `;

        db.get(sql, [id], callback);

    }

    // =====================================
    // Verify Messaging Permission
    // =====================================
    static canAccessConversation(userId, otherUserId, assetId, callback) {

        const sql = `
            SELECT
                leases.*,
                assets.title AS listing_title,
                owner.full_name AS owner_name,
                tenant.full_name AS tenant_name
            FROM leases
            JOIN assets
                ON assets.id = leases.asset_id
            JOIN users owner
                ON owner.id = leases.owner_id
            JOIN users tenant
                ON tenant.id = leases.tenant_id
            WHERE leases.asset_id = ?
            AND leases.status IN ('approved', 'active', 'completed')
            AND (
                (leases.owner_id = ? AND leases.tenant_id = ?)
                OR
                (leases.owner_id = ? AND leases.tenant_id = ?)
            )
        `;

        db.get(
            sql,
            [
                assetId,
                userId,
                otherUserId,
                otherUserId,
                userId
            ],
            callback
        );

    }
    // =====================================
    // Complete Lease
    // =====================================
    static completeLease(leaseId, ownerId, callback) {

        const sql = `
            UPDATE leases
            SET
                status = 'completed',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND owner_id = ?
            AND status IN ('approved', 'active')
            AND end_date <= date('now')
        `;

        db.run(sql, [leaseId, ownerId], function (err) {
            callback(err, this.changes);
        });

    }

}


module.exports = Lease;