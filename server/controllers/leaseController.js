const Lease = require("../models/Lease");
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

exports.showLeaseForm = (req, res) => {

    const assetId = req.params.assetId;

    Listing.getListingById(assetId, (err, listing) => {

        if (err) {

            console.error(err);
            return res.send("Failed to load listing.");

        }

        if (!listing) {

            return res.send("Listing not found.");

        }

        if (listing.owner_id === req.session.user.id) {

            req.session.flash = {

                type: "error",

                message: "You cannot lease your own listing."

            };

            return res.redirect("/listings/" + assetId);

        }

        res.render("lease-request", {

            user: req.session.user,
            listing

        });

    });

};

// =====================================================

exports.createLease = (req, res) => {

    const {

        asset_id,
        start_date,
        end_date,
        message

    } = req.body;

    Listing.getListingById(asset_id, (err, listing) => {

        if (err || !listing) {

            return res.send("Listing not found.");

        }

        if (listing.owner_id === req.session.user.id) {

            req.session.flash = {

                type: "error",

                message: "You cannot lease your own listing."

            };

            return res.redirect("/listings/" + asset_id);

        }

        const lease = {

            asset_id,

            owner_id: listing.owner_id,

            tenant_id: req.session.user.id,

            start_date,

            end_date,

            message

        };

        Lease.create(lease, (err) => {

            if (err) {

                console.error(err);

                return res.send("Failed to create lease request.");

            }

            Notification.create({

                user_id: listing.owner_id,

                title: "New Lease Request",

                message: `${req.session.user.full_name} requested to lease "${listing.title}".`,

                link: "/leases/owner"

            }, () => {

                req.session.flash = {

                    type: "success",

                    message: "Lease request submitted successfully."

                };

                res.redirect("/listings");

            });

        });

    });

};

// =====================================================

exports.showOwnerRequests = (req, res) => {

    Lease.getOwnerRequests(

        req.session.user.id,

        (err, requests) => {

            if (err) {

                console.error(err);

                return res.send("Failed to load requests.");

            }

            res.render("owner-requests", {

                user: req.session.user,

                requests

            });

        }

    );

};

// =====================================================

exports.showMyRequests = (req, res) => {

    Lease.getTenantRequests(

        req.session.user.id,

        (err, requests) => {

            if (err) {

                console.error(err);

                return res.send("Failed to load requests.");

            }

            res.render("tenant-requests", {

                user: req.session.user,

                requests

            });

        }

    );

};

// =====================================================

exports.approveLease = (req, res) => {

    const leaseId = req.params.id;

    const ownerId = req.session.user.id;

    Lease.approve(leaseId, ownerId, (err) => {

        if (err) {

            console.error(err);

            return res.send("Failed to approve lease.");

        }

        Lease.getById(leaseId, (err, lease) => {

            if (err || !lease) {

                console.error(err);

                return res.redirect("/leases/owner");

            }

            Message.send({

                sender_id: ownerId,

                receiver_id: lease.tenant_id,

                asset_id: lease.asset_id,

                message: "Your lease request has been approved. You can now chat with the owner."

            }, () => {

                Listing.getListingById(lease.asset_id, (err, listing) => {

                    Notification.create({

                        user_id: lease.tenant_id,

                        title: "Lease Approved",

                        message: `Your request for "${listing.title}" has been approved.`,

                        link: "/messages"

                    }, () => {

                        req.session.flash = {

                            type: "success",

                            message: "Lease approved."

                        };

                        res.redirect("/leases/owner");

                    });

                });

            });

        });

    });

};

// =====================================================

exports.rejectLease = (req, res) => {

    const leaseId = req.params.id;

    Lease.reject(

        leaseId,

        req.session.user.id,

        (err) => {

            if (err) {

                console.error(err);

                return res.send("Failed to reject lease.");

            }

            Lease.getById(leaseId, (err, lease) => {

                if (lease) {

                    Listing.getListingById(lease.asset_id, (err, listing) => {

                        Notification.create({

                            user_id: lease.tenant_id,

                            title: "Lease Request Declined",

                            message: `Your request for "${listing.title}" was declined.`,

                            link: "/leases/my-requests"

                        }, () => {

                            res.redirect("/leases/owner");

                        });

                    });

                }
                else {

                    res.redirect("/leases/owner");

                }

            });

        }

    );

};

// =====================================================

exports.completeLease = (req, res) => {

    const leaseId = req.params.id;

    Lease.completeLease(

        leaseId,

        (err) => {

            if (err) {

                console.error(err);

                return res.send("Failed to complete lease.");

            }

            Lease.getById(leaseId, (err, lease) => {

                if (lease) {

                    Listing.getListingById(lease.asset_id, (err, listing) => {

                        Notification.create({

                            user_id: lease.tenant_id,

                            title: "Lease Completed",

                            message: `Your lease for "${listing.title}" has been completed. Please leave a review.`,

                            link: `/reviews/new/${lease.id}`

                        }, () => {

                            req.session.flash = {

                                type: "success",

                                message: "Lease marked as completed."

                            };

                            res.redirect("/leases/owner");

                        });

                    });

                }
                else {

                    res.redirect("/leases/owner");

                }

            });

        }

    );

};