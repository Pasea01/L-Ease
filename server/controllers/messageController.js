const Message = require("../models/Message");
const Lease = require("../models/Lease");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

// =====================================================
// Inbox
// =====================================================

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

// =====================================================
// Conversation
// =====================================================

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

                    const otherUserName =

                        messages.length > 0

                            ? messages.find(

                                  m => m.sender_id !== userId

                              )?.full_name ||

                              messages[0].full_name

                            : "User";

                    const listingTitle =

                        messages.length > 0

                            ? messages[0].title ||

                              "Conversation"

                            : "Conversation";

                    res.render("conversation", {

                        user: req.session.user,

                        messages,

                        assetId,

                        otherUserId,

                        otherUserName,

                        listingTitle

                    });

                }

            );

        }

    );

};

// =====================================================
// Send Message
// =====================================================

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

    Message.send(

        {

            sender_id,

            receiver_id,

            asset_id,

            message

        },

        (err) => {

            if (err) {

                console.error(err);

                return res.send("Failed to send message.");

            }

            // ---------------------------------------
            // Create notification for receiver
            // ---------------------------------------

            Listing.getListingById(

                asset_id,

                (err, listing) => {

                    if (err || !listing) {

                        return res.redirect(

                            `/messages/${asset_id}/${receiver_id}`

                        );

                    }

                    Notification.create(

                        {

                            user_id: receiver_id,

                            title: "New Message",

                            message: `${req.session.user.full_name} sent you a message about "${listing.title}".`,

                            link: `/messages/${asset_id}/${sender_id}`

                        },

                        () => {

                            res.redirect(

                                `/messages/${asset_id}/${receiver_id}`

                            );

                        }

                    );

                }

            );

        }

    );

};