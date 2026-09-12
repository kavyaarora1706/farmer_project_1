const {
    ask,
    askNumber
} = require("../utils/input");

const {
    title,
    success,
    error,
    pause
} = require("../utils/display");

const {
    addCrop,
    getFarmerCrops
} = require("../services/cropService");

const {
    getFarmerOffers,
    getFarmerContracts,
    acceptContract,
    rejectContract,
    negotiateContract
} = require("../services/contractService");

const {
    getFarmerPayments
} = require("../services/paymentService");

async function addNewCrop(user) {
    title("ADD CROP");

    const cropName = await ask("Crop name: ");

    const quantity = await askNumber(
        "Quantity (kg): "
    );

    const price = await askNumber(
        "Expected price per kg: ₹"
    );

    const harvestDate = await ask(
        "Harvest date (YYYY-MM-DD): "
    );

    const crop = addCrop(
        user.id,
        user.name,
        cropName,
        quantity,
        price,
        harvestDate,
        user.location
    );

    success("Crop added successfully!");

    console.log(`Crop ID: ${crop.id}`);

    await pause();
}

async function showMyCrops(user) {
    title("MY CROPS");

    const crops = getFarmerCrops(user.id);

    if (crops.length === 0) {
        console.log("You have not added any crops.");
        await pause();
        return;
    }

    crops.forEach((crop) => {
        console.log("----------------------------------------");
        console.log(`ID              : ${crop.id}`);
        console.log(`Crop            : ${crop.cropName}`);
        console.log(`Total Quantity  : ${crop.quantity} kg`);
        console.log(
            `Available       : ${crop.availableQuantity} kg`
        );
        console.log(
            `Expected Price  : ₹${crop.expectedPrice}/kg`
        );
        console.log(`Status          : ${crop.status}`);
        console.log(
            `Harvest Date    : ${crop.harvestDate}`
        );
    });

    console.log("----------------------------------------");

    await pause();
}

async function showOffers(user) {
    title("BUYER OFFERS");

    const offers = getFarmerOffers(user.id);

    if (offers.length === 0) {
        console.log("No pending offers.");
        await pause();
        return;
    }

    offers.forEach((offer) => {
        console.log("----------------------------------------");
        console.log(`Contract ID : ${offer.id}`);
        console.log(`Buyer       : ${offer.buyerName}`);
        console.log(`Crop        : ${offer.cropName}`);
        console.log(`Quantity    : ${offer.quantity} kg`);
        console.log(
            `Price       : ₹${offer.pricePerKg}/kg`
        );
        console.log(
            `Total       : ₹${offer.totalAmount}`
        );
        console.log(`Status      : ${offer.status}`);
    });

    console.log("----------------------------------------");

    const contractId = await ask(
        "Enter Contract ID to manage (or press Enter): "
    );

    if (!contractId) {
        return;
    }

    const selectedOffer = offers.find(
        (offer) => offer.id === contractId
    );

    if (!selectedOffer) {
        error("Offer not found.");
        await pause();
        return;
    }

    console.log("\n1. Accept");
    console.log("2. Reject");
    console.log("3. Negotiate");

    const choice = await askNumber(
        "Enter choice: "
    );

    if (choice === 1) {
        const result = acceptContract(contractId);

        if (result.success) {
            success("Contract accepted successfully!");
        } else {
            error(result.message);
        }
    } else if (choice === 2) {
        const result = rejectContract(contractId);

        if (result.success) {
            success("Offer rejected.");
        } else {
            error(result.message);
        }
    } else if (choice === 3) {
        const newPrice = await askNumber(
            "Enter your new price per kg: ₹"
        );

        const result = negotiateContract(
            contractId,
            newPrice
        );

        if (result.success) {
            success("Counter offer sent to buyer.");
        } else {
            error(result.message);
        }
    } else {
        error("Invalid choice.");
    }

    await pause();
}

async function showContracts(user) {
    title("MY CONTRACTS");

    const contracts = getFarmerContracts(user.id);

    if (contracts.length === 0) {
        console.log("No contracts found.");
        await pause();
        return;
    }

    contracts.forEach((contract) => {
        console.log("----------------------------------------");
        console.log(`Contract ID : ${contract.id}`);
        console.log(`Buyer       : ${contract.buyerName}`);
        console.log(`Crop        : ${contract.cropName}`);
        console.log(`Quantity    : ${contract.quantity} kg`);
        console.log(
            `Price       : ₹${contract.pricePerKg}/kg`
        );
        console.log(
            `Total       : ₹${contract.totalAmount}`
        );
        console.log(`Status      : ${contract.status}`);
    });

    console.log("----------------------------------------");

    await pause();
}

async function showPayments(user) {
    title("MY PAYMENTS");

    const payments = getFarmerPayments(user.id);

    if (payments.length === 0) {
        console.log("No payments received.");
        await pause();
        return;
    }

    let total = 0;

    payments.forEach((payment) => {
        console.log("----------------------------------------");
        console.log(`Payment ID : ${payment.id}`);
        console.log(`Buyer      : ${payment.buyerName}`);
        console.log(`Amount     : ₹${payment.amount}`);
        console.log(`Status     : ${payment.status}`);
        console.log(`Date       : ${payment.date}`);

        total += payment.amount;
    });

    console.log("----------------------------------------");
    console.log(`Total Received: ₹${total}`);

    await pause();
}

async function show(user) {
    while (true) {
        title("FARMER MENU");

        console.log(`Welcome, ${user.name}`);
        console.log();
        console.log("1. Add Crop");
        console.log("2. My Crops");
        console.log("3. View Buyer Offers");
        console.log("4. My Contracts");
        console.log("5. Payments");
        console.log("6. Logout");

        const choice = await askNumber(
            "\nEnter choice: "
        );

        if (choice === 1) {
            await addNewCrop(user);
        } else if (choice === 2) {
            await showMyCrops(user);
        } else if (choice === 3) {
            await showOffers(user);
        } else if (choice === 4) {
            await showContracts(user);
        } else if (choice === 5) {
            await showPayments(user);
        } else if (choice === 6) {
            success("Logged out successfully.");
            break;
        } else {
            error("Invalid choice.");
        }
    }
}

module.exports = {
    show
};