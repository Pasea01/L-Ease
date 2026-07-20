const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "src/uploads/");

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// Only allow images
const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        cb(null, true);

    } else {

        cb(new Error("Only image files are allowed."), false);

    }

};

module.exports = multer({

    storage,
    fileFilter

});