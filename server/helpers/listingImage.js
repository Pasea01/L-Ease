
module.exports = function (listing) {
    if (!listing || !listing.image_url) {
        return "/images/default-listing.png";
    }

    return `/uploads/${listing.image_url}`;
};