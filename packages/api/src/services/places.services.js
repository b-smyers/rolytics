const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createPlace(roblox_place_id, experience_id, name) {
    const query = `INSERT INTO places (roblox_place_id, experience_id, name) VALUES (?, ?, ?)`;

    try {
        const result = await db.run(query, [roblox_place_id, experience_id, name]);
        console.log(`Place ${name} created`);
        return result.lastID;
    } catch (error) {
        console.error(`An error occured creating place: ${error.message}`);
    }
}

async function deletePlace(place_id) {
    const query = `DELETE FROM places WHERE place_id = ?`;

    try {
        const result = await db.run(query, [place_id]);

        return result;
    } catch (error) {
        console.error(`An error occured deleting place: ${error.message}`);
    }
}

async function updatePlace(place_id, name) {
    const query = `UPDATE places SET name = ? WHERE place_id = ?`;

    try {
        const result = await db.run(query, [name, place_id]);

        return result;
    } catch (error) {
        console.error(`An error occured updating place: ${error.message}`);
    }
}

async function getPlaceById(place_id) {
    const query = `SELECT * FROM places WHERE place_id = ?`;

    try {
        const result = await db.get(query, [place_id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting place by place_id: ${error.message}`);
    }
}

async function getPlaceByRobloxPlaceId(roblox_place_id) {
    const query = `SELECT * FROM places WHERE roblox_place_id = ?`;

    try {
        const result = await db.get(query, [roblox_place_id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting place by roblox_place_id: ${error.message}`);
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
    getPlaceByRobloxPlaceId,
    getPlacesByExperienceId
}