const Notification = require("../models/Notification");

// ======================================
// Open Notification
// ======================================

exports.openNotification = (req, res, next) => {

    const notificationId = req.params.id;

    const userId = req.session.user.id;

    Notification.getById(

        notificationId,

        (err, notification) => {

            if (err) {
                return next(err);
            }

            if (!notification) {
                const error = new Error("Notification not found.");
                error.status = 404;
                return next(error);

            }

            if (notification.user_id !== userId) {
                const error = new Error("Notification not found.");
                error.status = 404;
                return next(error);

            }

            Notification.markAsRead(

                notificationId,

                userId,

                (err) => {

                    if (err) {
                        req.session.flash = {
                            type: "error",
                            message: "We couldn't mark that notification as read."
                        };

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

exports.markAllAsRead = (req, res, next) => {

    const userId = req.session.user.id;

    Notification.markAllAsRead(

        userId,

        (err) => {

            if (err) {
                return next(err);

            }

            req.session.flash = {

                type: "success",

                message: "All notifications marked as read."

            };

            res.redirect("back");

        }

    );

};