const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imageUpload = require("../helpers/imageUpload");

// Storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const uploadPath = path.join(__dirname, "../../src/uploads");
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);

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

module.exports = multer({

    storage,
    fileFilter: imageUpload.fileFilter,
    limits: imageUpload.limits

});