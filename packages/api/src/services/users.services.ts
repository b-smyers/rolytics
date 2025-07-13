import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '@services/logger.services';
import settingsService from '@services/settings.services';
import db from '@services/sqlite.services';

interface User {
    id: number;
    username: string;
    email: string;
    api_key?: string;
    password?: string;
}

function createUser(username: string, email: string, password: string): { id: number, username: string, email: string } {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    const updateQuery = `UPDATE users SET api_key = ? WHERE id = ?`;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(insertQuery);
    const result = stmt.run(username, email, hashedPassword);
    const id = result.lastInsertRowid as number;

    logger.info(`New user ${id} account registered`);
    const api_key = jwt.sign({ id }, process.env.JWT_API_KEY_SECRET as string, { algorithm: 'HS256' });

    db.prepare(updateQuery).run(api_key, id);
    logger.info(`Initial API key for user ${id} set`);

    // Initialize default user settings
    settingsService.createSettings(id);

    return { id, username, email };
}

function deleteUser(id: number): boolean {
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

function updateUser(
    id: number,
    { username, email, password, api_key }: { username?: string; email?: string; password?: string; api_key?: string }
): void {
    const updates: string[] = [];
    const values: any[] = [];

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
        return;
    }

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    db.prepare(query).run(...values);

    logger.info(`User ${id} updated [${updates.map(v => v.split(' ')[0]).join(', ')}]`);
}

function validateCredentials(
    username: string,
    password: string
): false | { id: number; username: string; email: string } {
    const query = `SELECT id, username, email, password FROM users WHERE username = ?`;
    const row = db.prepare(query).get(username) as User | undefined;

    if (!row) {
        logger.warn(`Login failed because username '${username}' not found`);
        return false;
    }

    if (bcrypt.compareSync(password, row.password!)) {
        logger.info(`A user ${row.id} logged in`);
        return { id: row.id, username: row.username, email: row.email };
    } else {
        logger.info(`A user ${row.id} failed to login, incorrect username or password`);
        return false;
    }
}

function getUsersByUsername(username: string, limit: number = 10): User[] {
    logger.info(`Fetching users by username: '${username}' with limit ${limit}`);
    const query = `SELECT id, username, email, api_key FROM users WHERE username = ? LIMIT ?`;
    return db.prepare(query).all(username, limit) as User[];
}

function getUsersByEmail(email: string, limit: number = 10): User[] {
    logger.info(`Fetching users by email: '${email}' with limit ${limit}`);
    const query = `SELECT id, username, email, api_key FROM users WHERE email = ? LIMIT ?`;
    return db.prepare(query).all(email, limit) as User[];
}

function getUserById(id: number): User | undefined {
    logger.info(`Fetching user by ID: ${id}`);
    const query = `SELECT id, username, email, api_key FROM users WHERE id = ?`;
    return db.prepare(query).get(id) as User | undefined;
}

function getUsers(): User[] {
    logger.info(`Fetching all users`);
    const query = `SELECT id, username, email, api_key FROM users`;
    return db.prepare(query).all() as User[];
}

const usersService = {
    createUser,
    deleteUser,
    updateUser,
    validateCredentials,
    getUsersByUsername,
    getUsersByEmail,
    getUserById,
    getUsers
};

export default usersService;
