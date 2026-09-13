const { readData, writeData } = require("../utils/fileManager");

const FILE = "users.json";

function getUsers() {
    return readData(FILE);
}

function saveUsers(users) {
    writeData(FILE, users);
}

function generateUserId(users) {
    if (users.length === 0) {
        return "U1001";
    }

    const lastUser = users[users.length - 1];
    const lastNumber = Number(lastUser.id.substring(1));

    return `U${lastNumber + 1}`;
}

function registerUser(name, role, phone, location) {
    const users = getUsers();

    const user = {
        id: generateUserId(users),
        name,
        role,
        phone,
        location
    };

    users.push(user);
    saveUsers(users);

    return user;
}

function loginUser(id) {
    const users = getUsers();

    return users.find((user) => user.id === id);
}

module.exports = {
    getUsers,
    registerUser,
    loginUser
};