const Lease = require("../models/Lease");
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

const flashLeaseWarning = (req, res, message) => {
    req.session.flash = {
        type: "error",
        message
    };
    return res.redirect("/leases/owner");
};

exports.showLeaseForm = (req, res, next) => {

    const assetId = req.params.assetId;

    Listing.getListingById(assetId, (err, listing) => {

        if (err) {
            return next(err);

        }

        if (!listing) {
            const error = new Error("Listing not found.");
            error.status = 404;
            return next(error);

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

exports.createLease = (req, res, next) => {

    const {

        asset_id,
        start_date,
        end_date,
        message

    } = req.body;

    const assetId = Number(asset_id);
    const validDate = (value) => {
        if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
        }

        const parsed = new Date(`${value}T00:00:00Z`);
        return !Number.isNaN(parsed.getTime())
            && parsed.toISOString().slice(0, 10) === value;
    };
    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    const today = new Date().toISOString().slice(0, 10);

    if (
        !Number.isSafeInteger(assetId)
        || assetId < 1
        || !validDate(start_date)
        || !validDate(end_date)
        || start_date < today
        || end_date < start_date
        || trimmedMessage.length > 1000
    ) {
        req.session.flash = {
            type: "error",
            message: "Please enter valid lease dates and a message under 1,000 characters."
        };
        return res.redirect("/listings");
    }

    Listing.getListingById(assetId, (err, listing) => {

        if (err) {
            return next(err);
        }

        if (!listing) {
            const error = new Error("Listing not found.");
            error.status = 404;
            return next(error);

        }

        if (listing.owner_id === req.session.user.id) {

            req.session.flash = {

                type: "error",

                message: "You cannot lease your own listing."

            };

            return res.redirect("/listings/" + asset_id);

        }

        const lease = {

            asset_id: assetId,

            owner_id: listing.owner_id,

            tenant_id: req.session.user.id,

            start_date,

            end_date,

            message: trimmedMessage

        };

        Lease.create(lease, (err) => {

            if (err) {
                return next(err);

            }

            Notification.create({

                user_id: listing.owner_id,

                title: "New Lease Request",

                message: `${req.session.user.full_name} requested to lease "${listing.title}".`,

                link: "/leases/owner"

            }, (err) => {
                if (err) {
                    console.error(err);
                    req.session.flash = {
                        type: "error",
                        message: "Your lease request was submitted, but the owner could not be notified."
                    };
                    return res.redirect("/listings");
                }

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

exports.showOwnerRequests = (req, res, next) => {

    Lease.getOwnerRequests(

        req.session.user.id,

        (err, requests) => {

            if (err) {
                return next(err);

            }

            res.render("owner-requests", {

                user: req.session.user,

                requests

            });

        }

    );

};

// =====================================================

exports.showMyRequests = (req, res, next) => {

    Lease.getTenantRequests(

        req.session.user.id,

        (err, requests) => {

            if (err) {
                return next(err);

            }

            res.render("tenant-requests", {

                user: req.session.user,

                requests

            });

        }

    );

};

// =====================================================

exports.approveLease = (req, res, next) => {

    const leaseId = req.params.id;

    const ownerId = req.session.user.id;

    Lease.approve(leaseId, ownerId, (err, changes) => {

        if (err) {
            return next(err);

        }

        if (!changes) {
            return flashLeaseWarning(
                req,
                res,
                "This request is no longer pending or conflicts with another approved lease."
            );
        }

        Lease.getById(leaseId, (err, lease) => {

            if (err || !lease) {
                if (err) {
                    console.error(err);
                }
                req.session.flash = {
                    type: "error",
                    message: "The lease was approved, but related details could not be loaded."
                };
                return res.redirect("/leases/owner");

            }

            Message.send({

                sender_id: ownerId,

                receiver_id: lease.tenant_id,

                asset_id: lease.asset_id,

                message: "Your lease request has been approved. You can now chat with the owner."

            }, (err) => {
                if (err) {
                    console.error(err);
                    return flashLeaseWarning(
                        req,
                        res,
                        "The lease was approved, but the tenant could not be notified."
                    );
                }

                Listing.getListingById(lease.asset_id, (err, listing) => {
                    if (err || !listing) {
                        if (err) {
                            console.error(err);
                        }
                        return flashLeaseWarning(
                            req,
                            res,
                            "The lease was approved, but the tenant could not be notified."
                        );
                    }

                    Notification.create({

                        user_id: lease.tenant_id,

                        title: "Lease Approved",

                        message: `Your request for "${listing.title}" has been approved.`,

                        link: "/messages"

                    }, (err) => {
                        if (err) {
                            console.error(err);
                            return flashLeaseWarning(
                                req,
                                res,
                                "The lease was approved, but the tenant could not be notified."
                            );
                        }

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

exports.rejectLease = (req, res, next) => {

    const leaseId = req.params.id;

    Lease.reject(

        leaseId,

        req.session.user.id,

        (err, changes) => {

            if (err) {
                return next(err);

            }

            if (!changes) {
                return flashLeaseWarning(
                    req,
                    res,
                    "This request is no longer pending or could not be found."
                );
            }

            Lease.getById(leaseId, (err, lease) => {
                if (err) {
                    console.error(err);
                    return flashLeaseWarning(
                        req,
                        res,
                        "The request was declined, but the tenant could not be notified."
                    );
                }

                if (lease) {

                    Listing.getListingById(lease.asset_id, (err, listing) => {
                        if (err || !listing) {
                            if (err) {
                                console.error(err);
                            }
                            return flashLeaseWarning(
                                req,
                                res,
                                "The request was declined, but the tenant could not be notified."
                            );
                        }

                        Notification.create({

                            user_id: lease.tenant_id,

                            title: "Lease Request Declined",

                            message: `Your request for "${listing.title}" was declined.`,

                            link: "/leases/my-requests"

                        }, (err) => {
                            if (err) {
                                console.error(err);
                                return flashLeaseWarning(
                                    req,
                                    res,
                                    "The request was declined, but the tenant could not be notified."
                                );
                            }

                            req.session.flash = {
                                type: "success",
                                message: "Lease request declined."
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

// =====================================================

exports.completeLease = (req, res, next) => {

    const leaseId = req.params.id;

    Lease.completeLease(

        leaseId,
        req.session.user.id,

        (err, changes) => {

            if (err) {
                return next(err);

            }

            if (!changes) {
                return flashLeaseWarning(
                    req,
                    res,
                    "This lease is no longer approved or could not be found."
                );
            }

            Lease.getById(leaseId, (err, lease) => {
                if (err) {
                    console.error(err);
                    return flashLeaseWarning(
                        req,
                        res,
                        "The lease was completed, but the tenant could not be notified."
                    );
                }

                if (lease) {

                    Listing.getListingById(lease.asset_id, (err, listing) => {
                        if (err || !listing) {
                            if (err) {
                                console.error(err);
                            }
                            return flashLeaseWarning(
                                req,
                                res,
                                "The lease was completed, but the tenant could not be notified."
                            );
                        }

                        Notification.create({

                            user_id: lease.tenant_id,

                            title: "Lease Completed",

                            message: `Your lease for "${listing.title}" has been completed. Please leave a review.`,

                            link: `/reviews/new/${lease.id}`

                        }, (err) => {
                            if (err) {
                                console.error(err);
                                return flashLeaseWarning(
                                    req,
                                    res,
                                    "The lease was completed, but the tenant could not be notified."
                                );
                            }

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