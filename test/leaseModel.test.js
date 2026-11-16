const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { after, before, test } = require("node:test");

process.env.DATABASE_PATH = ":memory:";

const db = require("../server/database/db");
const Lease = require("../server/models/Lease");

const execute = (sql) => new Promise((resolve, reject) => {
    db.exec(sql, (error) => error ? reject(error) : resolve());
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
        if (error) {
            return reject(error);
        }
        resolve(this);
    });
});

const callModel = (method, ...args) => new Promise((resolve, reject) => {
    method(...args, (error, result) => {
        if (error) {
            return reject(error);
        }
        resolve(result);
    });
});

before(async () => {
    const schema = fs.readFileSync(
        path.join(__dirname, "../server/database/schema.sql"),
        "utf8"
    );
    await execute(schema);

    await run(
        `INSERT INTO users (id, full_name, email, password)
         VALUES
            (1, 'Owner', 'owner@example.test', 'hash'),
            (2, 'Tenant', 'tenant@example.test', 'hash'),
            (3, 'Other user', 'other@example.test', 'hash'),
            (4, 'Unrelated user', 'unrelated@example.test', 'hash')`
    );
    await run(
        `INSERT INTO assets
            (id, owner_id, title, category, price_per_day, location)
         VALUES (1, 1, 'Test asset', 'Vehicle', 100, 'Nairobi')`
    );
    await run(
        `INSERT INTO leases
            (id, asset_id, owner_id, tenant_id, start_date, end_date)
         VALUES
            (1, 1, 1, 2, '2000-01-01', '2000-01-10'),
            (2, 1, 1, 3, '2000-01-10', '2000-01-15'),
            (3, 1, 1, 3, '2099-01-01', '2099-01-10')`
    );
});

after(() => new Promise((resolve, reject) => {
    db.close((error) => error ? reject(error) : resolve());
}));

test("lease transitions require the owner and reject overlapping dates", async () => {
    assert.equal(await callModel(Lease.approve, 1, 3), 0);
    assert.equal(await callModel(Lease.approve, 1, 1), 1);
    assert.equal(await callModel(Lease.approve, 2, 1), 0);

    assert.equal(await callModel(Lease.approve, 3, 1), 1);
    assert.equal(await callModel(Lease.completeLease, 3, 1), 0);
    assert.equal(await callModel(Lease.completeLease, 1, 3), 0);
    assert.equal(await callModel(Lease.completeLease, 1, 1), 1);
    assert.equal(await callModel(Lease.completeLease, 1, 1), 0);

    assert.equal(await callModel(Lease.reject, 2, 1), 1);
    assert.equal(await callModel(Lease.approve, 2, 1), 0);

    const completedConversation = await callModel(
        Lease.canAccessConversation,
        1,
        2,
        1
    );
    assert.equal(completedConversation.listing_title, "Test asset");
    assert.equal(completedConversation.owner_name, "Owner");
    assert.equal(completedConversation.tenant_name, "Tenant");

    const cancelledConversation = await callModel(
        Lease.canAccessConversation,
        1,
        4,
        1
    );
    assert.equal(cancelledConversation, undefined);

    await run(
        `INSERT INTO reviews
            (lease_id, reviewer_id, reviewed_user_id, rating)
         VALUES (1, 2, 1, 5)`
    );
    await assert.rejects(
        run(
            `INSERT INTO reviews
                (lease_id, reviewer_id, reviewed_user_id, rating)
             VALUES (1, 2, 1, 4)`
        ),
        { code: "SQLITE_CONSTRAINT" }
    );
});
