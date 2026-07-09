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

}

module.exports = User;