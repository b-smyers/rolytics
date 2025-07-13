const db = require('@services/sqlite.services').default;
const logger = require('@services/logger.services');

function createPlace(roblox_place_id, experience_id, name) {
    const query = `INSERT INTO places (roblox_place_id, experience_id, name) VALUES (?, ?, ?)`;
    const result = db.prepare(query).run(roblox_place_id, experience_id, name);
    logger.info(`Place '${name}' created with Roblox Place ID ${roblox_place_id} and Experience ID ${experience_id}`);
    return result.lastInsertRowid;
}

function deletePlace(place_id) {
    const query = `DELETE FROM places WHERE place_id = ?`;
    const result = db.prepare(query).run(place_id);

    if (result.changes > 0) {
        logger.info(`Place with ID ${place_id} deleted`);
    } else {
        logger.warn(`Attempted to delete non-existent place with ID ${place_id}`);
    }

    return result.changes != 0;
}

function updatePlace(place_id, { name }) {
    if (name === undefined) {
        logger.warn(`No update provided for place ID ${place_id}`);
        return;
    }

    const query = `UPDATE places SET name = ? WHERE place_id = ?`;
    const result = db.prepare(query).run(name, place_id);

    if (result.changes > 0) {
        logger.info(`Place with ID ${place_id} updated with new name '${name}'`);
    } else {
        logger.warn(`Attempted to update non-existent place with ID ${place_id}`);
    }
}

function getPlaceById(place_id) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE place_id = ?`;
    const place = db.prepare(query).get(place_id);

    if (place) {
        logger.info(`Fetched place with ID ${place_id}`);
    } else {
        logger.warn(`No place found with ID ${place_id}`);
    }

    return place;
}

function getPlaceByRobloxPlaceId(roblox_place_id) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE roblox_place_id = ?`;
    const place = db.prepare(query).get(roblox_place_id);

    if (place) {
        logger.info(`Fetched place with Roblox Place ID ${roblox_place_id}`);
    } else {
        logger.warn(`No place found with Roblox Place ID ${roblox_place_id}`);
    }

    return place;
}

function getPlacesByExperienceId(experience_id, limit = 10) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE experience_id = ? LIMIT ?`;
    const places = db.prepare(query).all(experience_id, limit);

    logger.info(`Fetched ${places.length} place(s) for Experience ID ${experience_id} with limit ${limit}`);

    return places;
}

module.exports = {
    createPlace,
    deletePlace,
    updatePlace,
    getPlaceById,
    getPlaceByRobloxPlaceId,
    getPlacesByExperienceId
};