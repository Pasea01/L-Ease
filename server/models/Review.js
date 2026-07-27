const db = require("../database/db");

// ======================================
// Create Review
// ======================================

exports.create = (review, callback) => {

    const sql = `

        INSERT INTO reviews (

            lease_id,
            reviewer_id,
            reviewed_user_id,
            rating,
            comment

        )

        VALUES (?, ?, ?, ?, ?)

    `;

    db.run(

        sql,

        [

            review.lease_id,
            review.reviewer_id,
            review.reviewed_user_id,
            review.rating,
            review.comment

        ],

        callback

    );

};

// ======================================
// Check if Already Reviewed
// ======================================

exports.hasReviewed = (

    leaseId,
    reviewerId,
    callback

) => {

    const sql = `

        SELECT *

        FROM reviews

        WHERE lease_id = ?

        AND reviewer_id = ?

    `;

    db.get(

        sql,

        [

            leaseId,
            reviewerId

        ],

        callback

    );

};

// ======================================
// Reviews for a Lease
// ======================================

exports.getLeaseReviews = (

    leaseId,
    callback

) => {

    const sql = `

        SELECT

            reviews.*,

            users.full_name

        FROM reviews

        JOIN users

            ON users.id = reviews.reviewer_id

        WHERE reviews.lease_id = ?

        ORDER BY reviews.created_at DESC

    `;

    db.all(

        sql,

        [leaseId],

        callback

    );

};

// ======================================
// Reviews Received By User
// ======================================

exports.getUserReviews = (

    userId,
    callback

) => {

    const sql = `

        SELECT

            reviews.*,

            users.full_name

        FROM reviews

        JOIN users

            ON users.id = reviews.reviewer_id

        WHERE reviews.reviewed_user_id = ?

        ORDER BY reviews.created_at DESC

    `;

    db.all(

        sql,

        [userId],

        callback

    );

};

// ======================================
// Average Rating
// ======================================

exports.getAverageRating = (

    userId,
    callback

) => {

    const sql = `

        SELECT

            ROUND(AVG(rating),1) AS average,

            COUNT(*) AS total

        FROM reviews

        WHERE reviewed_user_id = ?

    `;

    db.get(

        sql,

        [userId],

        callback

    );

};

// ======================================
// Homepage Reviews
// ======================================

exports.getHomepageReviews = (callback) => {

    const sql = `

        SELECT

            reviews.*,

            users.full_name

        FROM reviews

        JOIN users

            ON reviews.reviewer_id = users.id

        ORDER BY reviews.created_at DESC

        LIMIT 3

    `;

    db.all(

        sql,

        callback

    );

};