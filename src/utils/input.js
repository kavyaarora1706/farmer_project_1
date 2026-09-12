const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function askNumber(question) {
    while (true) {
        const answer = await ask(question);
        const number = Number(answer);

        if (!isNaN(number)) {
            return number;
        }

        console.log("Please enter a valid number.");
    }
}

function closeInput() {
    rl.close();
}

module.exports = {
    ask,
    askNumber,
    closeInput
};