const Notification = require("../models/Notification");

// ======================================
// Open Notification
// ======================================

exports.openNotification = (req, res) => {

    const notificationId = req.params.id;

    const userId = req.session.user.id;

    Notification.getById(

        notificationId,

        (err, notification) => {

            if (err || !notification) {

                console.error(err);

                return res.redirect("/dashboard");

            }

            if (notification.user_id !== userId) {

                return res.redirect("/dashboard");

            }

            Notification.markAsRead(

                notificationId,

                userId,

                (err) => {

                    if (err) {

                        console.error(err);

                    }

                    res.redirect(

                        notification.link || "/dashboard"

                    );

                }

            );

        }

    );

};

// ======================================
// Mark All Notifications As Read
// ======================================

exports.markAllAsRead = (req, res) => {

    const userId = req.session.user.id;

    Notification.markAllAsRead(

        userId,

        (err) => {

            if (err) {

                console.error(err);

                req.session.flash = {

                    type: "error",

                    message: "Failed to mark notifications as read."

                };

                return res.redirect("back");

            }

            req.session.flash = {

                type: "success",

                message: "All notifications marked as read."

            };

            res.redirect("back");

        }

    );

};