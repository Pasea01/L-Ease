const assert = require("node:assert/strict");

process.env.DATABASE_PATH = ":memory:";

const db = require("../server/database/db");
const initializeDatabase = require("../server/database/initDatabase");
const app = require("../server/app");

const close = (server) => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
});

const closeDatabase = () => new Promise((resolve, reject) => {
    db.close((error) => error ? reject(error) : resolve());
});

const run = async () => {
    await initializeDatabase();
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    try {
        for (const route of ["/", "/about", "/login", "/register", "/listings", "/api/listings"]) {
            const response = await fetch(`${baseUrl}${route}`);
            assert.equal(response.status, 200, `${route} should load`);
        }

        const missing = await fetch(`${baseUrl}/missing-page`);
        assert.equal(missing.status, 404);
        assert.match(await missing.text(), /could not be found/i);

        console.log("Public route smoke tests passed.");
    } finally {
        await close(server);
        await closeDatabase();
    }
};

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
