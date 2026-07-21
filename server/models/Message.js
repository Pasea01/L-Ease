const db = require("../database/db");

class Message {

    // Get all conversations for a user
    static getInbox(userId, callback) {

        const sql = `
            SELECT
                m.asset_id,
                a.title,
                a.image_url,
                a.category,

                CASE
                    WHEN m.sender_id = ?
                    THEN u2.full_name
                    ELSE u1.full_name
                END AS other_user,

                CASE
                    WHEN m.sender_id = ?
                    THEN m.receiver_id
                    ELSE m.sender_id
                END AS other_user_id,

                m.message AS last_message,

                MAX(m.created_at) AS last_time

            FROM messages m

            JOIN assets a
                ON m.asset_id = a.id

            JOIN users u1
                ON m.sender_id = u1.id

            JOIN users u2
                ON m.receiver_id = u2.id

            WHERE
                m.sender_id = ?
                OR m.receiver_id = ?

            GROUP BY
                m.asset_id,
                other_user_id

            ORDER BY
                last_time DESC
        `;

        db.all(
            sql,
            [userId, userId, userId, userId],
            callback
        );

    }

    // Send a message
    static send(message, callback) {

    const sql = `
        INSERT INTO messages
        (
            sender_id,
            receiver_id,
            asset_id,
            message
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            message.sender_id,
            message.receiver_id,
            message.asset_id,
            message.message
        ],
        callback
    );
    }

    // Get conversation
static getConversation(userId, otherUserId, assetId, callback) {

    const sql = `
        SELECT
            messages.*,
            users.full_name
        FROM messages
        JOIN users
            ON messages.sender_id = users.id
        WHERE
            asset_id = ?
        AND
        (
            (sender_id = ? AND receiver_id = ?)
            OR
            (sender_id = ? AND receiver_id = ?)
        )
        ORDER BY created_at ASC
    `;

    db.all(
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

}

module.exports = Message;