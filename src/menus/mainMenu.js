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
    registerUser,
    loginUser
} = require("../services/userService");

const {
    getAvailableCrops
} = require("../services/cropService");

const farmerMenu = require("./farmerMenu");
const buyerMenu = require("./buyerMenu");

async function register() {
    title("REGISTER");

    const name = await ask("Name: ");

    console.log("\nRole:");
    console.log("1. Farmer");
    console.log("2. Buyer");

    const roleChoice = await askNumber(
        "Enter choice: "
    );

    let role;

    if (roleChoice === 1) {
        role = "farmer";
    } else if (roleChoice === 2) {
        role = "buyer";
    } else {
        error("Invalid role.");
        return;
    }

    const phone = await ask("Phone: ");
    const location = await ask("Location: ");

    const user = registerUser(
        name,
        role,
        phone,
        location
    );

    success("Registration successful!");

    console.log(`Your User ID: ${user.id}`);

    await pause();
}

function displayCrops() {
    const crops = getAvailableCrops();

    title("AVAILABLE CROPS");

    if (crops.length === 0) {
        console.log("No crops available.");
        return;
    }

    crops.forEach((crop) => {
        console.log("----------------------------------------");
        console.log(`Crop ID       : ${crop.id}`);
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
}

async function login() {
    title("LOGIN");

    const id = await ask("Enter User ID: ");

    const user = loginUser(id);

    if (!user) {
        error("User not found.");
        await pause();
        return;
    }

    success(`Welcome, ${user.name}!`);

    if (user.role === "farmer") {
        await farmerMenu.show(user);
    } else {
        await buyerMenu.show(user);
    }
}

async function showMainMenu() {
    while (true) {
        title("ASSURED CONTRACT FARMING SYSTEM");

        console.log("1. Register");
        console.log("2. Login");
        console.log("3. Browse Available Crops");
        console.log("4. Exit");

        const choice = await askNumber(
            "\nEnter choice: "
        );

        if (choice === 1) {
            await register();
        } else if (choice === 2) {
            await login();
        } else if (choice === 3) {
            displayCrops();
            await pause();
        } else if (choice === 4) {
            console.log("\nThank you for using the system!");
            break;
        } else {
            error("Invalid choice.");
        }
    }
}

module.exports = {
    showMainMenu
};