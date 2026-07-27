const db = require("../database/db");

// ======================================
// Create Notification
// ======================================

exports.create = (notification, callback) => {

    const sql = `

        INSERT INTO notifications (

            user_id,

            title,

            message,

            link

        )

        VALUES (?, ?, ?, ?)

    `;

    db.run(

        sql,

        [

            notification.user_id,

            notification.title,

            notification.message,

            notification.link

        ],

        callback

    );

};

// ======================================
// Latest Notifications
// ======================================

exports.getForUser = (

    userId,

    callback

) => {

    const sql = `

        SELECT *

        FROM notifications

        WHERE user_id = ?

        ORDER BY created_at DESC

        LIMIT 10

    `;

    db.all(

        sql,

        [userId],

        callback

    );

};

// ======================================
// Unread Count
// ======================================

exports.getUnreadCount = (

    userId,

    callback

) => {

    const sql = `

        SELECT COUNT(*) AS total

        FROM notifications

        WHERE user_id = ?

        AND is_read = 0

    `;

    db.get(

        sql,

        [userId],

        callback

    );

};

// ======================================
// Mark One Notification As Read
// ======================================

exports.markAsRead = (

    id,

    userId,

    callback

) => {

    const sql = `

        UPDATE notifications

        SET is_read = 1

        WHERE id = ?

        AND user_id = ?

    `;

    db.run(

        sql,

        [

            id,

            userId

        ],

        callback

    );

};

// ======================================
// Mark All Notifications As Read
// ======================================

exports.markAllAsRead = (

    userId,

    callback

) => {

    const sql = `

        UPDATE notifications

        SET is_read = 1

        WHERE user_id = ?

        AND is_read = 0

    `;

    db.run(

        sql,

        [userId],

        callback

    );

};

// ======================================
// Get One Notification
// ======================================

exports.getById = (

    id,

    callback

) => {

    const sql = `

        SELECT *

        FROM notifications

        WHERE id = ?

    `;

    db.get(

        sql,

        [id],

        callback

    );

};