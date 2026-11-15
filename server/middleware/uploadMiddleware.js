const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let folder = "listings";

        if (req.originalUrl.includes("/profile")) {

            folder = "profiles";

        }

        const uploadPath = path.join(
            __dirname,
            "../../src/uploads",
            folder
        );

        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);

    },

    filename: (req, file, cb) => {

        let prefix = "listing";

        if (req.originalUrl.includes("/profile")) {

            prefix = "profile";

        }

        const filename =
            `${prefix}-${Date.now()}${path.extname(file.originalname)}`;

        cb(null, filename);

    }

});

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        cb(null, true);

    } else {

        cb(new Error("Only image files are allowed."));

    }

};

module.exports = multer({

    storage,
    fileFilter

});