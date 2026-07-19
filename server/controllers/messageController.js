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

exports.showConversation = (req, res) => {

    const userId = req.session.user.id;
    const otherUserId = req.params.otherUserId;
    const assetId = req.params.assetId;

    Message.getConversation(

        userId,
        otherUserId,
        assetId,

        (err, messages) => {

            if (err) {

                console.error(err);
                return res.send("Failed to load conversation.");

            }

            res.render("conversation", {

                user: req.session.user,
                messages,
                assetId,
                otherUserId

            });

        }

    );

};