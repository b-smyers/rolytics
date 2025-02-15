const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const settingsService = require('@services/settings.services');
const db = require('@services/sqlite.services');

function createUser(username, email, password) {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    const updateQuery = `UPDATE users SET api_key = ? WHERE id = ?`;
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(insertQuery);
    const result = stmt.run(username, email, hashedPassword);
    
    const id = result.lastInsertRowid;
    const api_key = jwt.sign({ id }, process.env.JWT_API_KEY_SECRET, { algorithm: 'HS256' });
    
    db.prepare(updateQuery).run(api_key, id);
    console.log('New user registered:', username);

    // Initialize default user settings
    settingsService.createSettings(id);
    
    return { id, username, email };
}

function deleteUser(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return db.prepare(query).run(id).changes != 0;
}

function updateUser(id, { username, email, password, api_key }) {
    const updates = [];
    const values = [];

    if (username) {
        updates.push('username = ?');
        values.push(username);
    }
    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (password) {
        updates.push('password = ?');
        values.push(bcrypt.hashSync(password, 10));
    }
    if (api_key) {
        updates.push('api_key = ?');
        values.push(api_key);
    }

    if (updates.length === 0) return;

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    db.prepare(query).run(...values);
}

function validateCredentials(username, password) {
    const query = `SELECT id, username, email, password FROM users WHERE username = ?`;
    const row = db.prepare(query).get(username);

    if (!row) return false;
    if (bcrypt.compareSync(password, row.password)) {
        console.log('A user logged in:', username);
        return { id: row.id, username: row.username, email: row.email };
    } else {
        console.log('A user failed to login:', username);
        return false;
    }
}

function getUsersByUsername(username, limit = 10) {
    const query = `SELECT id, username, email, api_key FROM users WHERE username = ? LIMIT ?`;
    return db.prepare(query).all(username, limit);
}

function getUsersByEmail(email, limit = 10) {
    const query = `SELECT id, username, email, api_key FROM users WHERE email = ? LIMIT ?`;
    return db.prepare(query).all(email, limit);
}

function getUserById(id) {
    const query = `SELECT id, username, email, api_key FROM users WHERE id = ?`;
    return db.prepare(query).get(id);
}

function getUsers() {
    const query = `SELECT id, username, email, api_key FROM users`;
    return db.prepare(query).all();
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