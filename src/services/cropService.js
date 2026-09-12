const { readData, writeData } = require("../utils/fileManager");

const FILE = "crops.json";

function getCrops() {
    return readData(FILE);
}

function saveCrops(crops) {
    writeData(FILE, crops);
}

function generateCropId(crops) {
    if (crops.length === 0) {
        return "C1001";
    }

    const lastCrop = crops[crops.length - 1];
    const lastNumber = Number(lastCrop.id.substring(1));

    return `C${lastNumber + 1}`;
}

function addCrop(
    farmerId,
    farmerName,
    cropName,
    quantity,
    price,
    harvestDate,
    location
) {
    const crops = getCrops();

    const crop = {
        id: generateCropId(crops),
        farmerId,
        farmerName,
        cropName,
        quantity,
        availableQuantity: quantity,
        expectedPrice: price,
        harvestDate,
        location,
        status: "Available"
    };

    crops.push(crop);
    saveCrops(crops);

    return crop;
}

function getFarmerCrops(farmerId) {
    const crops = getCrops();

    return crops.filter((crop) => crop.farmerId === farmerId);
}

function getAvailableCrops() {
    const crops = getCrops();

    return crops.filter(
        (crop) =>
            crop.status === "Available" &&
            crop.availableQuantity > 0
    );
}

function findCrop(cropId) {
    const crops = getCrops();

    return crops.find((crop) => crop.id === cropId);
}

function updateCrop(updatedCrop) {
    const crops = getCrops();

    const index = crops.findIndex(
        (crop) => crop.id === updatedCrop.id
    );

    if (index !== -1) {
        crops[index] = updatedCrop;
        saveCrops(crops);
        return true;
    }

    return false;
}

module.exports = {
    getCrops,
    addCrop,
    getFarmerCrops,
    getAvailableCrops,
    findCrop,
    updateCrop
};