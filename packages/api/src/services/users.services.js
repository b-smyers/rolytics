const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createUser(username, email, password) {
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(query, [username, email, hashedPassword]);
        const userId = result.lastID

        // Generate JWT token and add it to user
        const user = {
            id: userId
        }
        const api_key = jwt.sign(user, process.env.JWT_API_KEY_SECRET, { algorithm: 'HS256' }); // No expiry
        await db.run(`UPDATE users SET api_key = ? WHERE id = ?`, [api_key, userId]);

        console.log(api_key, " ", api_key.length);

        console.log('New user registered:', username);
        return { userId, username, email };
    } catch (error) {
        throw new Error(`Unable to register user: ${error.message}`);
    }
}

async function deleteUser(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    try {
        const result = await db.run(query, [id]);

        return result;
    } catch (error) {
        throw new Error(`Unable to delete user: ${error.message}`);
    }
}

async function updateUser(id, username, email, password, api_key) {
    const query = `UPDATE users SET username = ?, email = ?, password = ?, api_key = ? WHERE id = ?`;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(query, [username, email, hashedPassword, api_key, id]);

        return result;
    } catch (error) {
        throw new Error(`Unable to update user: ${error.message}`);
    }
}

async function validate_credentials(username, password) {
    const query = `SELECT * FROM users WHERE username = ?`;
    try {
        const row = await db.get(query, [username]);
        if (!row || !row.password) { return false; }

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

async function getUsersByUsername(username, limit = 10) {
    const query = `SELECT * FROM users WHERE username = ? LIMIT ${limit}`;
    try {
        const row = await db.get(query, [username]);
        return row && row.username;
    } catch (error) {
        throw new Error(`Unable to get user by username: ${error.message}`);
    }
}

async function getUsersByEmail(email, limit = 10) {
    const query = `SELECT * FROM users WHERE email = ? LIMIT ${limit}`;
    try {
        const row = await db.get(query, [email]);
        return row && row.email;
    } catch (error) {
        throw new Error(`Unable to get user by email: ${error.message}`);
    }
}

async function getUserById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    try {
        const row = await db.get(query, [id]);
        return row;
    } catch (error) {
        throw new Error(`Unable to get user: ${error.message}`);
    }
}

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    validate_credentials,
    getUsersByUsername,
    getUsersByEmail,
    getUserById
};