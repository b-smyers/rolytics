const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function getExperiences(userId) {
    const query = `SELECT * FROM experiences WHERE user_id = ?`;
    try {
        return await db.all(query, [userId]);
    } catch (error) {
        throw new Error(`Unable to get user's experiences: ${error.message}`);
    }
}

module.exports = {
    getExperiences,
}