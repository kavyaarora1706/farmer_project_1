const { showMainMenu } = require("./menus/mainMenu");
const { closeInput } = require("./utils/input");

async function startApplication() {
    console.clear();

    console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║       ASSURED CONTRACT FARMING           ║
║              SYSTEM CLI                  ║
║                                          ║
║     Connecting Farmers & Buyers          ║
║                                          ║
╚══════════════════════════════════════════╝
    `);

    try {
        await showMainMenu();
    } catch (error) {
        console.log("\nSomething went wrong.");
        console.log(error.message);
    } finally {
        closeInput();
    }
}

startApplication();