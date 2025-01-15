const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createPlace(roblox_place_id, experience_id, name) {
    const query = `INSERT INTO places (roblox_place_id, experience_id, name) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(query, [roblox_place_id, experience_id, name], function (error) {
            if (error) {
                console.error(`An error occured creating place: ${error.message}`);
                reject(error);
            }
            console.log(`Place ${name} created`);
            resolve(this.lastID);
        });
    });
}

async function deletePlace(place_id) {
    const query = `DELETE FROM places WHERE place_id = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [place_id], function (error) {
            if (error) {
                console.error(`An error occured deleting place: ${error.message}`);
                reject(error);
            }
            console.log(`Place deleted`);
            resolve();
        });
    });
}

async function updatePlace(place_id, { name }) {
    const values = [];
    let query = `UPDATE places SET`;

    if (name !== undefined) {
        query += ` name = ?`;
        values.push(name);
    }

    query += " WHERE place_id = ?";
    values.push(place_id);

    return new Promise((resolve, reject) => {
        db.run(query, values, function (error) {
            if (error) {
                console.error(`An error occured updating place: ${error.message}`);
                reject(error);
            }
            console.log(`Place updated`);
            resolve();
        });
    });
}

async function getPlaceById(place_id) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE place_id = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [place_id], function (error, row) {
            if (error) {
                console.error(`An error occured getting place by id: ${error.message}`);
                reject(error);
            }
            resolve(row);
        });
    });
}

async function getPlaceByRobloxPlaceId(roblox_place_id) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE roblox_place_id = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [roblox_place_id], function (error, row) {
            if (error) {
                console.error(`An error occured getting place by roblox_place_id: ${error.message}`);
                reject(error);
            }
            resolve(row);
        });
    });
}

async function getPlacesByExperienceId(experience_id, limit = 10) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE experience_id = ? LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [experience_id], function (error, row) {
            if (error) {
                console.error(`An error occured getting places by experience_id: ${error.message}`);
                reject(error);
            }
            resolve(row);
        });
    });
}


module.exports = {
    createPlace,
    deletePlace,
    updatePlace,
    getPlaceById,
    getPlaceByRobloxPlaceId,
    getPlacesByExperienceId
}