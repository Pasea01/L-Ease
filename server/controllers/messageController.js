const Message = require("../models/Message");

const Lease = require("../models/Lease");

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
    const otherUserId = Number(req.params.otherUserId);
    const assetId = Number(req.params.assetId);

    Lease.canAccessConversation(

        userId,
        otherUserId,
        assetId,

        (err, lease) => {

            if (err) {

                console.error(err);

                return res.send("Failed to verify access.");

            }

            if (!lease) {

                return res.status(403).send("Access denied.");

            }

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

        }

    );

};

exports.sendMessage = (req, res) => {

    const senderId = req.session.user.id;

    const {

        receiver_id,
        asset_id,
        message

    } = req.body;

    Lease.canAccessConversation(

        senderId,
        Number(receiver_id),
        Number(asset_id),

        (err, lease) => {

            if (err) {

                console.error(err);

                return res.send("Failed to verify permission.");

            }

            if (!lease) {

                return res.status(403).send("Access denied.");

            }

            Message.send({

                sender_id: senderId,
                receiver_id,
                asset_id,
                message

            }, (err) => {

                if (err) {

                    console.error(err);

                    return res.send("Failed to send message.");

                }

                res.redirect(`/messages/${asset_id}/${receiver_id}`);

            });

        }

    );

};

exports.sendMessage = (req, res) => {

    const sender_id = req.session.user.id;

    const {

        receiver_id,
        asset_id,
        message

    } = req.body;

    if (!message.trim()) {

        return res.redirect(
            `/messages/${asset_id}/${receiver_id}`
        );

    }

    Message.send({

        sender_id,
        receiver_id,
        asset_id,
        message

    }, (err) => {

        if (err) {

            console.error(err);

            return res.send("Failed to send message.");

        }

        res.redirect(
            `/messages/${asset_id}/${receiver_id}`
        );

    });

};