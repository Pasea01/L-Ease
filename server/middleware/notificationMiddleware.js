const Notification = require("../models/Notification");

module.exports = (req, res, next) => {

    // Default values for guests
    res.locals.notifications = [];
    res.locals.unreadNotifications = 0;

    if (!req.session.user) {

        return next();

    }

    Notification.getForUser(

        req.session.user.id,

        (err, notifications) => {

            if (err) {

                console.error(err);

                return next();

            }

            Notification.getUnreadCount(

                req.session.user.id,

                (err, unread) => {

                    if (err) {

                        console.error(err);

                        return next();

                    }

                    res.locals.notifications = notifications;

                    res.locals.unreadNotifications = unread.total;

                    next();

                }

            );

        }

    );

};