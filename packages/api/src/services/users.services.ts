import { DBUser, User } from "types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "@services/logger.services";
import settingsService from "@services/settings.services";
import db from "@services/sqlite.services";

function createUser(username: string, email: string, password: string): User {
  const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  const updateQuery = `UPDATE users SET api_key = ? WHERE id = ?`;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(insertQuery);
  const result = stmt.run(username, email, hashedPassword);
  const id = result.lastInsertRowid as number;

  logger.info(`New user '${id}' account registered`);
  const api_key = jwt.sign({ id }, process.env.JWT_API_KEY_SECRET, {
    algorithm: "HS256",
  });

  db.prepare(updateQuery).run(api_key, id);
  logger.info(`Initial API key for user '${id}' set`);

  // Initialize default user settings
  settingsService.createSettings(id);

  const newUser: User = {
    id,
    username,
    email,
  };

  return newUser;
}

function deleteUser(id: number): boolean {
  const query = `DELETE FROM users WHERE id = ?`;
  const changes = db.prepare(query).run(id).changes;

  if (changes !== 0) {
    logger.info(`User ${id} hard deleted successfully`);
  } else {
    logger.warn(`Cannot delete non-existent user '${id}'`);
  }

  return changes !== 0;
}

function updateUser(
  id: number,
  {
    username,
    email,
    password,
    api_key,
  }: { username?: string; email?: string; password?: string; api_key?: string },
): void {
  const updates: string[] = [];
  const values: string[] = [];

  if (username) {
    updates.push("username = ?");
    values.push(username);
  }
  if (email) {
    updates.push("email = ?");
    values.push(email);
  }
  if (password) {
    updates.push("password = ?");
    values.push(bcrypt.hashSync(password, 10));
  }
  if (api_key) {
    updates.push("api_key = ?");
    values.push(api_key);
  }

  if (updates.length === 0) {
    logger.warn(`No updates provided for user '${id}'`);
    return;
  }

  const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  values.push(String(id));
  db.prepare(query).run(...values);

  logger.info(
    `User '${id}' updated [${updates.map((v) => v.split(" ")[0]).join(", ")}]`,
  );
}

function validateCredentials(
  username: string,
  password: string,
): User | undefined {
  const query = `SELECT id, username, email, password FROM users WHERE username = ?`;
  const row = db.prepare(query).get(username) as DBUser | undefined;

  if (!row) {
    logger.warn(`Login failed because username '${username}' not found`);
    return;
  }

  if (bcrypt.compareSync(password, row.password)) {
    logger.info(`A user ${row.id} logged in`);
    const user: User = {
      id: row.id,
      username: row.username,
      email: row.email,
    };
    return user;
  } else {
    logger.info(
      `A user '${row.id}' failed to login, incorrect username or password`,
    );
    return;
  }
}

function getUsersByUsername(
  username: string,
  limit: number = 10,
): User[] | undefined {
  logger.info(`Fetching users by username: '${username}' with limit ${limit}`);
  const query = `SELECT id, username, email, api_key FROM users WHERE username = ? LIMIT ?`;
  const users = db.prepare(query).all(username, limit) as User[] | undefined;

  if (users) {
    logger.info(`Fetched users with username '${username}'`);
  } else {
    logger.info(`No users found with username '${username}'`);
  }

  return users;
}

function getUsersByEmail(
  email: string,
  limit: number = 10,
): User[] | undefined {
  logger.info(`Fetching users by email: '${email}' with limit ${limit}`);
  const query = `SELECT id, username, email, api_key FROM users WHERE email = ? LIMIT ?`;
  const users = db.prepare(query).all(email, limit) as User[] | undefined;

  if (users) {
    logger.info(`Fetched users with email '${email}'`);
  } else {
    logger.info(`No users found with email '${email}'`);
  }

  return users;
}

function getUserById(id: number): User | undefined {
  logger.info(`Fetching user by ID: ${id}`);
  const query = `SELECT id, username, email, api_key FROM users WHERE id = ?`;
  const user = db.prepare(query).get(id) as User | undefined;

  if (user) {
    logger.info(`Fetched user with id '${id}'`);
  } else {
    logger.warn(`No user found with id '${id}'`);
  }

  return user;
}

function getUsers(): User[] | undefined {
  logger.info("Fetching all users");
  const query = `SELECT id, username, email, api_key FROM users`;
  const users = db.prepare(query).all() as User[] | undefined;

  if (users) {
    logger.info("Fetched users");
  } else {
    logger.info("No users found");
  }

  return users;
}

export default {
  createUser,
  deleteUser,
  updateUser,
  validateCredentials,
  getUsersByUsername,
  getUsersByEmail,
  getUserById,
  getUsers,
};
