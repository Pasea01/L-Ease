const Message = require("../models/Message");

exports.showInbox = (req, res) => {

    Message.getInbox(
        req.session.user.id,
        (err, conversations) => {

            if (err) {

                console.error(err);
                return res.send("Failed to load inbox.");

            }

            res.render("inbox", {

                user: req.session.user,
                conversations

            });

        }
    );

};