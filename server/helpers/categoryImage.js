function getCategoryImage(category) {

    const images = {

        "Property": "/images/categories/property.png",
        "Vehicle": "/images/categories/vehicle.png",
        "Electronics": "/images/categories/electronics.png",
        "Furniture": "/images/categories/furniture.png",
        "Tools": "/images/categories/tools.png",
        "Equipment": "/images/categories/equipment.png",
        "Livestock": "/images/categories/livestock.png",
        "Other": "/images/categories/other.png"

    };

    return images[category] || "/images/categories/other.png";

}

module.exports = getCategoryImage;