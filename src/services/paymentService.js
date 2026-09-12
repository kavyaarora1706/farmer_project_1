const { readData, writeData } = require("../utils/fileManager");
const { findContract } = require("./contractService");

const FILE = "payments.json";

function getPayments() {
    return readData(FILE);
}

function savePayments(payments) {
    writeData(FILE, payments);
}

function generatePaymentId(payments) {
    if (payments.length === 0) {
        return "P1001";
    }

    const lastPayment = payments[payments.length - 1];

    const lastNumber = Number(
        lastPayment.id.substring(1)
    );

    return `P${lastNumber + 1}`;
}

function makePayment(contractId) {
    const contract = findContract(contractId);

    if (!contract) {
        return {
            success: false,
            message: "Contract not found."
        };
    }

    if (contract.status !== "Active") {
        return {
            success: false,
            message: "Payment is only allowed for active contracts."
        };
    }

    const payments = getPayments();

    const alreadyPaid = payments.find(
        (payment) =>
            payment.contractId === contractId
    );

    if (alreadyPaid) {
        return {
            success: false,
            message: "Payment has already been made."
        };
    }

    const payment = {
        id: generatePaymentId(payments),
        contractId,
        farmerId: contract.farmerId,
        farmerName: contract.farmerName,
        buyerId: contract.buyerId,
        buyerName: contract.buyerName,
        amount: contract.totalAmount,
        status: "Paid",
        date: new Date().toLocaleString()
    };

    payments.push(payment);
    savePayments(payments);

    return {
        success: true,
        payment
    };
}

function getFarmerPayments(farmerId) {
    const payments = getPayments();

    return payments.filter(
        (payment) => payment.farmerId === farmerId
    );
}

function getBuyerPayments(buyerId) {
    const payments = getPayments();

    return payments.filter(
        (payment) => payment.buyerId === buyerId
    );
}

module.exports = {
    getPayments,
    makePayment,
    getFarmerPayments,
    getBuyerPayments
};