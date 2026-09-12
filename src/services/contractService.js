const { readData, writeData } = require("../utils/fileManager");
const {
    findCrop,
    updateCrop
} = require("./cropService");

const FILE = "contracts.json";

function getContracts() {
    return readData(FILE);
}

function saveContracts(contracts) {
    writeData(FILE, contracts);
}

function generateContractId(contracts) {
    if (contracts.length === 0) {
        return "CT1001";
    }

    const lastContract = contracts[contracts.length - 1];

    const lastNumber = Number(
        lastContract.id.substring(2)
    );

    return `CT${lastNumber + 1}`;
}

function createOffer(
    buyerId,
    buyerName,
    cropId,
    quantity,
    price
) {
    const contracts = getContracts();
    const crop = findCrop(cropId);

    if (!crop) {
        return {
            success: false,
            message: "Crop not found."
        };
    }

    if (crop.availableQuantity < quantity) {
        return {
            success: false,
            message: "Requested quantity is not available."
        };
    }

    const contract = {
        id: generateContractId(contracts),
        cropId,
        cropName: crop.cropName,

        farmerId: crop.farmerId,
        farmerName: crop.farmerName,

        buyerId,
        buyerName,

        quantity,
        pricePerKg: price,
        totalAmount: quantity * price,

        status: "Offer Sent",

        createdAt: new Date().toLocaleString()
    };

    contracts.push(contract);
    saveContracts(contracts);

    return {
        success: true,
        contract
    };
}

function getFarmerOffers(farmerId) {
    const contracts = getContracts();

    return contracts.filter(
        (contract) =>
            contract.farmerId === farmerId &&
            (
                contract.status === "Offer Sent" ||
                contract.status === "Negotiation"
            )
    );
}

function getBuyerContracts(buyerId) {
    const contracts = getContracts();

    return contracts.filter(
        (contract) => contract.buyerId === buyerId
    );
}

function getFarmerContracts(farmerId) {
    const contracts = getContracts();

    return contracts.filter(
        (contract) => contract.farmerId === farmerId
    );
}

function findContract(contractId) {
    const contracts = getContracts();

    return contracts.find(
        (contract) => contract.id === contractId
    );
}

function updateContract(updatedContract) {
    const contracts = getContracts();

    const index = contracts.findIndex(
        (contract) =>
            contract.id === updatedContract.id
    );

    if (index === -1) {
        return false;
    }

    contracts[index] = updatedContract;
    saveContracts(contracts);

    return true;
}

function acceptContract(contractId) {
    const contract = findContract(contractId);

    if (!contract) {
        return {
            success: false,
            message: "Contract not found."
        };
    }

    if (
        contract.status !== "Offer Sent" &&
        contract.status !== "Negotiation"
    ) {
        return {
            success: false,
            message: "This offer cannot be accepted."
        };
    }

    const crop = findCrop(contract.cropId);

    if (!crop) {
        return {
            success: false,
            message: "Crop not found."
        };
    }

    if (crop.availableQuantity < contract.quantity) {
        return {
            success: false,
            message: "Not enough crop quantity available."
        };
    }

    crop.availableQuantity -= contract.quantity;

    if (crop.availableQuantity === 0) {
        crop.status = "Contracted";
    }

    updateCrop(crop);

    contract.status = "Active";
    contract.acceptedAt = new Date().toLocaleString();

    updateContract(contract);

    return {
        success: true,
        contract
    };
}

function rejectContract(contractId) {
    const contract = findContract(contractId);

    if (!contract) {
        return {
            success: false,
            message: "Contract not found."
        };
    }

    contract.status = "Rejected";

    updateContract(contract);

    return {
        success: true
    };
}

function negotiateContract(contractId, newPrice) {
    const contract = findContract(contractId);

    if (!contract) {
        return {
            success: false,
            message: "Contract not found."
        };
    }

    contract.pricePerKg = newPrice;
    contract.totalAmount =
        contract.quantity * newPrice;

    contract.status = "Negotiation";

    updateContract(contract);

    return {
        success: true,
        contract
    };
}

module.exports = {
    getContracts,
    createOffer,
    getFarmerOffers,
    getBuyerContracts,
    getFarmerContracts,
    findContract,
    acceptContract,
    rejectContract,
    negotiateContract
};