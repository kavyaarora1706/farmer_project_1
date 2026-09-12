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
    getAvailableCrops,
    findCrop
} = require("../services/cropService");

const {
    createOffer,
    getBuyerContracts,
    findContract
} = require("../services/contractService");

const {
    makePayment,
    getBuyerPayments
} = require("../services/paymentService");

async function browseCrops() {
    title("AVAILABLE CROPS");

    const crops = getAvailableCrops();

    if (crops.length === 0) {
        console.log("No crops are currently available.");
        await pause();
        return;
    }

    crops.forEach((crop) => {
        console.log("----------------------------------------");
        console.log(`Crop ID       : ${crop.id}`);
        console.log(`Farmer        : ${crop.farmerName}`);
        console.log(`Crop          : ${crop.cropName}`);
        console.log(
            `Available     : ${crop.availableQuantity} kg`
        );
        console.log(
            `Expected Price: ₹${crop.expectedPrice}/kg`
        );
        console.log(`Location      : ${crop.location}`);
        console.log(
            `Harvest Date  : ${crop.harvestDate}`
        );
    });

    console.log("----------------------------------------");

    await pause();
}

async function makeOffer(user) {
    title("MAKE OFFER");

    const cropId = await ask(
        "Enter Crop ID: "
    );

    const crop = findCrop(cropId);

    if (!crop) {
        error("Crop not found.");
        await pause();
        return;
    }

    console.log(`\nCrop: ${crop.cropName}`);
    console.log(
        `Available: ${crop.availableQuantity} kg`
    );
    console.log(
        `Farmer's expected price: ₹${crop.expectedPrice}/kg`
    );

    const quantity = await askNumber(
        "\nQuantity required (kg): "
    );

    if (quantity <= 0) {
        error("Quantity must be greater than zero.");
        await pause();
        return;
    }

    if (quantity > crop.availableQuantity) {
        error("Requested quantity is not available.");
        await pause();
        return;
    }

    const price = await askNumber(
        "Your offer price per kg: ₹"
    );

    const result = createOffer(
        user.id,
        user.name,
        cropId,
        quantity,
        price
    );

    if (result.success) {
        success("Offer sent to farmer!");

        console.log(
            `Contract ID: ${result.contract.id}`
        );

        console.log(
            `Total value: ₹${result.contract.totalAmount}`
        );
    } else {
        error(result.message);
    }

    await pause();
}

async function showContracts(user) {
    title("MY CONTRACTS");

    const contracts = getBuyerContracts(user.id);

    if (contracts.length === 0) {
        console.log("No contracts found.");
        await pause();
        return;
    }

    contracts.forEach((contract) => {
        console.log("----------------------------------------");
        console.log(`Contract ID : ${contract.id}`);
        console.log(`Farmer      : ${contract.farmerName}`);
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

async function makeContractPayment(user) {
    title("MAKE PAYMENT");

    const contracts = getBuyerContracts(user.id);

    const activeContracts = contracts.filter(
        (contract) => contract.status === "Active"
    );

    if (activeContracts.length === 0) {
        console.log("No active contracts available for payment.");
        await pause();
        return;
    }

    activeContracts.forEach((contract) => {
        console.log("----------------------------------------");
        console.log(`Contract ID : ${contract.id}`);
        console.log(`Farmer      : ${contract.farmerName}`);
        console.log(`Crop        : ${contract.cropName}`);
        console.log(`Amount      : ₹${contract.totalAmount}`);
    });

    console.log("----------------------------------------");

    const contractId = await ask(
        "Enter Contract ID: "
    );

    const contract = findContract(contractId);

    if (!contract || contract.buyerId !== user.id) {
        error("Invalid contract.");
        await pause();
        return;
    }

    console.log(
        `\nPayment amount: ₹${contract.totalAmount}`
    );

    const confirm = await ask(
        "Confirm payment? (yes/no): "
    );

    if (confirm.toLowerCase() !== "yes") {
        console.log("Payment cancelled.");
        await pause();
        return;
    }

    const result = makePayment(contractId);

    if (result.success) {
        success("Payment completed successfully!");

        console.log(
            `Payment ID: ${result.payment.id}`
        );
    } else {
        error(result.message);
    }

    await pause();
}

async function showPayments(user) {
    title("MY PAYMENTS");

    const payments = getBuyerPayments(user.id);

    if (payments.length === 0) {
        console.log("No payments made.");
        await pause();
        return;
    }

    payments.forEach((payment) => {
        console.log("----------------------------------------");
        console.log(`Payment ID : ${payment.id}`);
        console.log(`Farmer     : ${payment.farmerName}`);
        console.log(`Amount     : ₹${payment.amount}`);
        console.log(`Status     : ${payment.status}`);
        console.log(`Date       : ${payment.date}`);
    });

    console.log("----------------------------------------");

    await pause();
}

async function show(user) {
    while (true) {
        title("BUYER MENU");

        console.log(`Welcome, ${user.name}`);
        console.log();
        console.log("1. Browse Available Crops");
        console.log("2. Make Offer");
        console.log("3. My Contracts");
        console.log("4. Make Payment");
        console.log("5. Payment History");
        console.log("6. Logout");

        const choice = await askNumber(
            "\nEnter choice: "
        );

        if (choice === 1) {
            await browseCrops();
        } else if (choice === 2) {
            await makeOffer(user);
        } else if (choice === 3) {
            await showContracts(user);
        } else if (choice === 4) {
            await makeContractPayment(user);
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