function line() {
    console.log("========================================");
}

function title(text) {
    console.log();
    line();
    console.log(`     ${text}`);
    line();
}

function success(message) {
    console.log(`\n✓ ${message}`);
}

function error(message) {
    console.log(`\n✗ ${message}`);
}

function pause() {
    return new Promise((resolve) => {
        const readline = require("readline");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("\nPress Enter to continue...", () => {
            rl.close();
            resolve();
        });
    });
}

module.exports = {
    line,
    title,
    success,
    error,
    pause
};