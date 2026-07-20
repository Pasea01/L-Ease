const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const leaseController = require("../controllers/leaseController");

router.get(
    "/request/:assetId",
    authMiddleware,
    leaseController.showLeaseForm
);

router.post(
    "/request",
    authMiddleware,
    leaseController.createLease
);

router.get(
    "/owner",
    authMiddleware,
    leaseController.showOwnerRequests
);

router.post(
    "/:id/approve",
    authMiddleware,
    leaseController.approveLease
);

router.post(
    "/:id/reject",
    authMiddleware,
    leaseController.rejectLease
);

router.get(
    "/my-requests",
    authMiddleware,
    leaseController.showMyRequests
);

module.exports = router;