PRAGMA foreign_keys = ON;

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    full_name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    phone TEXT,

    profile_image TEXT DEFAULT 'default.png',

    role TEXT NOT NULL DEFAULT 'user'
        CHECK(role IN ('user', 'admin')),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- ASSETS
-- =====================================================

CREATE TABLE IF NOT EXISTS assets (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    owner_id INTEGER NOT NULL,

    title TEXT NOT NULL,

    description TEXT,

    category TEXT NOT NULL,

    price_per_day REAL NOT NULL,

    location TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'available'
        CHECK(status IN ('available', 'leased', 'unavailable')),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);

-- =====================================================
-- ASSET IMAGES
-- =====================================================

CREATE TABLE IF NOT EXISTS asset_images (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_id INTEGER NOT NULL,

    image_url TEXT NOT NULL,

    FOREIGN KEY(asset_id)
        REFERENCES assets(id)
        ON DELETE CASCADE

);

-- =====================================================
-- LEASES
-- =====================================================

CREATE TABLE IF NOT EXISTS leases (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_id INTEGER NOT NULL,

    lessee_id INTEGER NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    total_price REAL NOT NULL,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK(status IN (
            'pending',
            'approved',
            'active',
            'completed',
            'cancelled'
        )),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(asset_id)
        REFERENCES assets(id)
        ON DELETE CASCADE,

    FOREIGN KEY(lessee_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    lease_id INTEGER NOT NULL,

    reviewer_id INTEGER NOT NULL,

    reviewed_user_id INTEGER NOT NULL,

    rating INTEGER NOT NULL
        CHECK(rating BETWEEN 1 AND 5),

    comment TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(lease_id)
        REFERENCES leases(id)
        ON DELETE CASCADE,

    FOREIGN KEY(reviewer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(reviewed_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);

-- =====================================================
-- MESSAGES
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    sender_id INTEGER NOT NULL,

    receiver_id INTEGER NOT NULL,

    asset_id INTEGER,

    message TEXT NOT NULL,

    is_read INTEGER NOT NULL DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(receiver_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(asset_id)
        REFERENCES assets(id)
        ON DELETE SET NULL

);