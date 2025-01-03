const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createExperience(roblox_experience_id, user_id, name, description, page_link, thumbnail_link) {
    const query = `INSERT INTO experiences (roblox_experience_id, user_id, name, description, page_link, thumbnail_link) VALUES (?, ?, ?, ?, ?, ?)`;
    try {
        const result = await db.run(query, [roblox_experience_id, user_id, name.substring(0, 50), description.substring(0, 1000), page_link, thumbnail_link]);
        console.log(`Experience ${name} created`);
        return result.lastID; // Return internal ID of the experience
    } catch (error) {
        throw new Error(`Unable to create experience: ${error.message}`);
    }
}

async function deleteExperience(experience_id) {
    const query = `DELETE FROM experiences WHERE experience_id = ?`;
    try {
        await db.run(query, [experience_id]);
    } catch (error) {
        throw new Error(`Unable to delete experience: ${error.message}`);
    }
}

async function updateExperience(experience_id, name, description, page_link, thumbnail_link) {
    const query = `UPDATE experiences SET name = ?, description = ?, page_link = ?, thumbnail_link = ? WHERE experience_id = ?`;
    try {
        await db.run(query, [name.substring(0, 50), description.substring(0, 1000), page_link, thumbnail_link, experience_id]);
    } catch (error) {
        throw new Error(`Unable to update experience: ${error.message}`);
    }
}

async function getExperienceById(experience_id) {
    const query = `SELECT * FROM experiences WHERE experience_id = ?`;
    try {
        return await db.get(query, [experience_id]);
    } catch (error) {
        throw new Error(`Unable to get experience: ${error.message}`);
    }
}

async function getExperiencesByUserId(user_id, limit = 10) {
    const query = `SELECT * FROM experiences WHERE user_id = ? LIMIT ${limit}`;
    try {
        return await db.all(query, [user_id]);
    } catch (error) {
        throw new Error(`Unable to get user's experiences: ${error.message}`);
    }
}

async function getExperienceCountByUserId(user_id) {
    const query = `SELECT COUNT(*) AS count FROM experiences WHERE user_id = ?`;
    try {
        const result = await db.get(query, [user_id]);
        return result.count;
    } catch (error) {
        throw new Error(`Unable to get user's experience count: ${error.message}`);
    }
}

module.exports = {
    createExperience,
    deleteExperience,
    updateExperience,
    getExperienceById,
    getExperiencesByUserId,
    getExperienceCountByUserId
}