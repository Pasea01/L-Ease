
module.exports = function (input) {
    if (!input) {
        return null;
    }

    const image =
        typeof input === "object"
            ? input.profile_image
            : input;

    if (!image || image === "default.png") {
        return null;
    }

    return `/uploads/profiles/${image}`;
};