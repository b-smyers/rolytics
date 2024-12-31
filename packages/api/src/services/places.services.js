const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createPlace(id, experience_id, name) {
    const query = `INSERT INTO places (id, experience_id, name) VALUES (?, ?, ?)`;

    try {
        const result = await db.run(query, [id, experience_id, name]);

        return result;
    } catch (error) {
        console.error(`An error occured creating place: ${error.message}`);
    }
}

async function deletePlace(id) {
    const query = `DELETE FROM places WHERE id = ?`;

    try {
        const result = await db.run(query, [id]);

        return result;
    } catch (error) {
        console.error(`An error occured deleting place: ${error.message}`);
    }
}

async function updatePlace(id, name) {
    const query = `UPDATE places SET name = ? WHERE id = ?`;

    try {
        const result = await db.run(query, [name, id]);

        return result;
    } catch (error) {
        console.error(`An error occured updating place: ${error.message}`);
    }
}

async function getPlaceById(id) {
    const query = `SELECT * FROM places WHERE id = ?`;

    try {
        const result = await db.get(query, [id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting place by id: ${error.message}`);
    }
}

async function getPlacesByExperienceId(experience_id, limit = 10) {
    const query = `SELECT * FROM places WHERE experience_id = ? LIMIT ${limit}`;

    try {
        const result = await db.all(query, [experience_id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting places by experience id: ${error.message}`);
    }
}


module.exports = {
    createPlace,
    deletePlace,
    updatePlace,
    getPlaceById,
    getPlacesByExperienceId
}