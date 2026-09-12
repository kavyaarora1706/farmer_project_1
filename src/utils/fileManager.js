const fs = require("fs");
const path = require("path");

function getFilePath(fileName) {
    return path.join(__dirname, "../../data", fileName);
}

function readData(fileName) {
    const filePath = getFilePath(fileName);

    try {
        const data = fs.readFileSync(filePath, "utf-8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.log("Error reading data file.");
        return [];
    }
}

function writeData(fileName, data) {
    const filePath = getFilePath(fileName);

    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify(data, null, 2),
            "utf-8"
        );
    } catch (error) {
        console.log("Error saving data.");
    }
}

module.exports = {
    readData,
    writeData
};