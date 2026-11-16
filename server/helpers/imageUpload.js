const path = require("path");

const imageTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
};

exports.fileFilter = (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (imageTypes[extension] === file.mimetype) {
        return callback(null, true);
    }

    const error = new Error("Only image files are allowed.");
    error.code = "INVALID_IMAGE_TYPE";
    callback(error);
};

exports.limits = {
    fileSize: 5 * 1024 * 1024
};
