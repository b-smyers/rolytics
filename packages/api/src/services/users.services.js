const bcrypt = require('bcrypt');
const database = require('@services/sqlite.services');

let db;
async function init() {
    db = await database;
}
init().catch(console.error);

async function registerUser(username, email, password) {
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(query, [username, email, hashedPassword]);
        const userId = result.lastID
        console.log('New user registered:', username);
        return { userId, username, email };
    } catch (error) {
        throw new Error(`Unable to register user: ${error.message}`);
    }
}

async function loginUser(username, password) {
    const query = `SELECT * FROM users WHERE username = ?`;
    try {
        const row = await db.get(query, [username]);
        if (!row) { return false; }

        const isPasswordCorrect = await bcrypt.compare(password, row.password);
        if (isPasswordCorrect) {
            console.log('A user logged in:', username);
            return { id: row.id, username: row.username, email: row.email };
        } else {
            console.log('A user failed to login:', username);
            return false;
        }
    } catch (error) {
        throw new Error(`Unable to login user: ${error.message}`);
    }
}

// TODO: This is not working properly and is hallucinating users.
async function findExistingAccounts(username, email) {
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`
    try {
        const row = await db.get(query, [username, email]);
        return row && (row.username || row.email);
    } catch (error) {
        throw new Error(`Unable to find existing users: ${error.message}`);
    }
}

async function getUser(userId) {
    const query = `SELECT * FROM users WHERE user_id = ?`;
    try {
        const row = await db.get(query, [userId]);
        return row;
    } catch (error) {
        throw new Error(`Unable to get user: ${error.message}`);
    }
}

module.exports = {
    registerUser,
    loginUser,
    findExistingAccounts,
    getUser,
};