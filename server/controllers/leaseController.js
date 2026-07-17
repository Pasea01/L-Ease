const Lease = require("../models/Lease");
const Listing = require("../models/Listing");

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

        res.render("lease-request", {

            user: req.session.user,
            listing

        });

    });

};

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

            res.send("🎉 Lease request submitted successfully!");

        });

    });

};

exports.showOwnerRequests = (req, res) => {

    const ownerId = req.session.user.id;

    Lease.getOwnerRequests(ownerId, (err, requests) => {

        if (err) {

            console.error(err);

            return res.send("Failed to load requests.");

        }

        res.render("owner-requests", {

            user: req.session.user,
            requests

        });

    });

};

exports.approveLease = (req, res) => {

    Lease.approve(
        req.params.id,
        req.session.user.id,
        (err) => {

            if (err) {

                console.error(err);
                return res.send("Failed to approve lease.");

            }

            res.redirect("/leases/owner");

        }
    );

};

exports.rejectLease = (req, res) => {

    Lease.reject(
        req.params.id,
        req.session.user.id,
        (err) => {

            if (err) {

                console.error(err);
                return res.send("Failed to reject lease.");

            }

            res.redirect("/leases/owner");

        }
    );

};