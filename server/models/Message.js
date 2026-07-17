const db = require("../database/db");

class Message {

    // Get all conversations for a user
    static getInbox(userId, callback) {

        const sql = `
            SELECT DISTINCT
                m.asset_id,
                a.title,
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

                MAX(m.created_at) AS last_message

            FROM messages m

            JOIN assets a
                ON m.asset_id = a.id

            JOIN users u1
                ON m.sender_id = u1.id

            JOIN users u2
                ON m.receiver_id = u2.id

            WHERE
                m.sender_id = ?
                OR
                m.receiver_id = ?

            GROUP BY
                m.asset_id,
                other_user_id

            ORDER BY
                last_message DESC
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

}

module.exports = Message;