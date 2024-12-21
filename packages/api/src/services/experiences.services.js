const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function getExperiences(user_id) {
    const query = `SELECT * FROM experiences WHERE user_id = ?`;
    try {
        return await db.all(query, [user_id]);
    } catch (error) {
        throw new Error(`Unable to get user's experiences: ${error.message}`);
    }
}

async function findExistingExperience(user_id, universe_id) {
    const query = `SELECT * FROM experiences WHERE user_id = ? AND universe_id = ?`;
    try {
        const row = await db.get(query, [user_id, universe_id]);
        return row && (row.user_id || row.universe_id);
    } catch (error) {
        throw new Error(`Unable to find existing experiences: ${error.message}`);
    }
}

async function connectExperience(user_id, universe_id, thumbnail_link, page_link, title, description) {
    const query = `INSERT INTO experiences (user_id, universe_id, thumbnail_link, page_link, title, description) VALUES (?, ?, ?, ?, ?, ?)`;
    try {
        const result = await db.run(query, [user_id, universe_id, thumbnail_link, page_link, title, description.substring(0, 1024)]);
    } catch (error) {
        throw new Error(`Unable to get user's experiences: ${error.message}`);
    }
}

async function getExperienceCount(user_id) {
    const query = `SELECT COUNT(*) AS count FROM experiences WHERE user_id = ?`;
    try {
        const result = await db.get(query, [user_id]);
        return result.count;
    } catch (error) {
        throw new Error(`Unable to get user's experience count: ${error.message}`);
    }
}

module.exports = {
    getExperiences,
    findExistingExperience,
    connectExperience,
    getExperienceCount
}