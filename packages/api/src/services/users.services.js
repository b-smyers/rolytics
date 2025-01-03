const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createUser(username, email, password) {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    const updateQuery = `UPDATE users SET api_key = ? WHERE id = ?`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await new Promise((resolve, reject) => {
        db.run(insertQuery, [username, email, hashedPassword], function (error) {
            if (error) {
                console.error(`An error occured creating user: ${error.message}`);
                return reject(error);
            }
            resolve(this.lastID);
        });
    });

    // Generate JWT token and add it to user
    const api_key = jwt.sign({ id: userId }, process.env.JWT_API_KEY_SECRET, { algorithm: 'HS256' }); // No expiry

    return new Promise((resolve, reject) => {
        db.run(updateQuery, [api_key, userId], function (error) {
            if (error) {
                console.error(`An error occured creating api_key for userID ${userId}: ${error.message}`);
                return reject(error);
            }
            console.log(api_key, " ", api_key.length);
            console.log('New user registered:', username);
            resolve({ userId, username, email });
        });
    });
}

async function deleteUser(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(query, [id], function (error) {
            if (error) {
                console.error(`An error occured deleting user: ${error.message}`);
                return reject(error);
            }
            resolve();
        });
    });
}

async function updateUser(id, { username, email, password, api_key }) {
    const values = [];
    let query = `UPDATE users SET`;

    if (username !== undefined) {
        query += ` username = ?`;
        values.push(username);
    }

    if (email !== undefined) {
        query += ` email = ?`;
        values.push(email);
    }

    if (password !== undefined) {
        query += ` password = ?`;
        const hashedPassword = await bcrypt.hash(password, 10);
        values.push(hashedPassword);
    }

    if (api_key !== undefined) {
        query += ` api_key = ?`;
        values.push(api_key);
    }

    query += " WHERE id = ?";
    values.push(id);

    return new Promise((resolve, reject) => {
        db.run(query, values, function (error) {
            if (error) {
                console.error(`An error occured updating user: ${error.message}`);
                return reject(error);
            }
            resolve();
        });
    });
}

async function validateCredentials(username, password) {
    const query = `SELECT * FROM users WHERE username = ?`;
    try {
        const row = await new Promise((resolve, reject) => {
            db.get(query, [username], function (error, row) {
                if (error) {
                    console.error(`An error occured validating credentials: ${error.message}`);
                    return reject(error);
                }
                resolve(row);
            });
        });

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

async function getUsersByUsername(username, limit = 10) {
    const query = `SELECT * FROM users WHERE username = ? LIMIT ${limit}`;
    return new Promise((resolve, reject) => {
        db.all(query, [username], function (error, row) {
            if (error) {
                console.error(`An error occured getting users by username: ${error.message}`);
                return reject(error);
            }
            resolve(row);
        });
    });
}

async function getUsersByEmail(email, limit = 10) {
    const query = `SELECT * FROM users WHERE email = ? LIMIT ${limit}`;
    return new Promise((resolve, reject) => {
        db.all(query, [email], function (error, row) {
            if (error) {
                console.error(`An error occured getting users by email: ${error.message}`);
                return reject(error);
            }
            resolve(row);
        });
    });
}

async function getUserById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [id], function (error, row) {
            if (error) {
                console.error(`An error occured getting user by id: ${error.message}`);
                return reject(error);
            }
            resolve(row);
        });
    });
}

async function getUsers() {
    const query = `SELECT * FROM users`;
    return new Promise((resolve, reject) => {
        db.all(query, function (error, rows) {
            if (error) {
                console.error(`An error occured getting users: ${error.message}`);
                return reject(error);
            }
            resolve(rows);
        });
    });
}

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    validateCredentials,
    getUsersByUsername,
    getUsersByEmail,
    getUserById,
    getUsers
};