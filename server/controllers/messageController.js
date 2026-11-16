const Message = require("../models/Message");
const Lease = require("../models/Lease");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

// =====================================================
// Inbox
// =====================================================

exports.showInbox = (req, res, next) => {

    Message.getInbox(

        req.session.user.id,

        (err, conversations) => {

            if (err) {
                return next(err);

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

exports.showConversation = (req, res, next) => {

    const userId = req.session.user.id;

    const otherUserId = Number(req.params.otherUserId);

    const assetId = Number(req.params.assetId);

    Lease.canAccessConversation(

        userId,

        otherUserId,

        assetId,

        (err, lease) => {

            if (err) {
                return next(err);

            }

            if (!lease) {
                const error = new Error("Access denied.");
                error.status = 403;
                return next(error);

            }

            Message.markConversationRead(
                userId,
                otherUserId,
                assetId,
                (err) => {
                    if (err) {
                        return next(err);
                    }

                    Message.getConversation(
                        userId,
                        otherUserId,
                        assetId,
                        (err, messages) => {
                            if (err) {
                                return next(err);
                            }

                            const otherUserName = userId === lease.owner_id
                                ? lease.tenant_name
                                : lease.owner_name;

                            res.render("conversation", {
                                user: req.session.user,
                                messages,
                                assetId,
                                otherUserId,
                                otherUserName,
                                listingTitle: lease.listing_title
                            });
                        }
                    );
                }
            );

        }

    );

};

// =====================================================
// Send Message
// =====================================================

exports.sendMessage = (req, res, next) => {

    const sender_id = req.session.user.id;

    const receiverId = Number(req.body.receiver_id);
    const assetId = Number(req.body.asset_id);
    const message = typeof req.body.message === "string"
        ? req.body.message.trim()
        : "";
    const validConversation = Number.isSafeInteger(receiverId)
        && receiverId > 0
        && receiverId !== sender_id
        && Number.isSafeInteger(assetId)
        && assetId > 0;
    const redirectUrl = validConversation
        ? `/messages/${assetId}/${receiverId}`
        : "/messages";

    if (!validConversation || !message || message.length > 2000) {
        req.session.flash = {
            type: "error",
            message: "Please enter a message of 1-2,000 characters in a valid conversation."
        };
        return res.redirect(redirectUrl);
    }

    Lease.canAccessConversation(
        sender_id,
        receiverId,
        assetId,
        (err, lease) => {
            if (err) {
                return next(err);
            }

            if (!lease) {
                const error = new Error("Access denied.");
                error.status = 403;
                return next(error);
            }

            Message.send(
                {
                    sender_id,
                    receiver_id: receiverId,
                    asset_id: assetId,
                    message
                },
                (err) => {

                    if (err) {
                        return next(err);

                    }

            // ---------------------------------------
            // Create notification for receiver
            // ---------------------------------------

            Listing.getListingById(

                assetId,

                (err, listing) => {

                    if (err || !listing) {
                        if (err) {
                            console.error(err);
                        }

                        req.session.flash = {
                            type: "error",
                            message: "Your message was sent, but we couldn't notify the recipient."
                        };

                        return res.redirect(redirectUrl);

                    }

                    Notification.create(

                        {

                            user_id: receiverId,

                            title: "New Message",

                            message: `${req.session.user.full_name} sent you a message about "${listing.title}".`,

                            link: `/messages/${assetId}/${sender_id}`

                        },

                        (err) => {
                            if (err) {
                                console.error(err);
                                req.session.flash = {
                                    type: "error",
                                    message: "Your message was sent, but we couldn't notify the recipient."
                                };
                            }

                            res.redirect(redirectUrl);

                        }

                    );

                }

            );

                }
            );
        }
    );

};