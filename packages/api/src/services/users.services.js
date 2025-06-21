const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('@services/logger.services');
const settingsService = require('@services/settings.services');
const db = require('@services/sqlite.services');

function createUser(username, email, password) {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    const updateQuery = `UPDATE users SET api_key = ? WHERE id = ?`;
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(insertQuery);
    const result = stmt.run(username, email, hashedPassword);
    const id = result.lastInsertRowid;
    
    logger.info(`New user ${id} account registered`);
    const api_key = jwt.sign({ id }, process.env.JWT_API_KEY_SECRET, { algorithm: 'HS256' });
    
    db.prepare(updateQuery).run(api_key, id);
    logger.info(`Initial API key for user ${id} set`);

    // Initialize default user settings
    settingsService.createSettings(id);
    
    return { id, username, email };
}

function deleteUser(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    const changes = db.prepare(query).run(id).changes;

    if (changes !== 0) {
        logger.info(`User ${id} hard deleted successfully`);
        return true;
    } else {
        logger.warn(`Cannot delete non-existent user ${id}`);
        return false;
    }
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

    if (updates.length === 0) {
        logger.warn(`No updates provided for user ${id}`);
        return        
    };

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    db.prepare(query).run(...values);
    
    logger.info(`User ${id} updated [${updates.map(v => v.split(' ')[0]).join(', ')}]`);
}

function validateCredentials(username, password) {
    const query = `SELECT id, username, email, password FROM users WHERE username = ?`;
    const row = db.prepare(query).get(username);

    if (!row) {
        logger.warn(`Login failed because username '${username}' not found`);
        return false
    };

    if (bcrypt.compareSync(password, row.password)) {
        logger.info(`A user ${row.id} logged in`);
        return { id: row.id, username: row.username, email: row.email };
    } else {
        logger.info(`A user ${row.id} failed to login, incorrect username or password`);
        return false;
    }
}

function getUsersByUsername(username, limit = 10) {
    logger.info(`Fetching users by username: '${username}' with limit ${limit}`);
    const query = `SELECT id, username, email, api_key FROM users WHERE username = ? LIMIT ?`;
    return db.prepare(query).all(username, limit);
}

function getUsersByEmail(email, limit = 10) {
    logger.info(`Fetching users by email: '${email}' with limit ${limit}`);
    const query = `SELECT id, username, email, api_key FROM users WHERE email = ? LIMIT ?`;
    return db.prepare(query).all(email, limit);
}

function getUserById(id) {
    logger.info(`Fetching user by ID: ${id}`);
    const query = `SELECT id, username, email, api_key FROM users WHERE id = ?`;
    return db.prepare(query).get(id);
}

function getUsers() {
    logger.info(`Fetching all users`);
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