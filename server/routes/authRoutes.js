const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Registration
router.post("/register", authController.register);

module.exports = router;