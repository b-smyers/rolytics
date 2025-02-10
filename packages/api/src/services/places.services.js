const db = require('@services/sqlite.services');

function createPlace(roblox_place_id, experience_id, name) {
    const query = `INSERT INTO places (roblox_place_id, experience_id, name) VALUES (?, ?, ?)`;
    const result = db.prepare(query).run(roblox_place_id, experience_id, name);
    console.log(`Place ${name} created`);
    return result.lastInsertRowid;
}

function deletePlace(place_id) {
    const query = `DELETE FROM places WHERE place_id = ?`;
    const result = db.prepare(query).run(place_id);
    console.log(`Place deleted`);
    return result.changes != 0;
}

function updatePlace(place_id, { name }) {
    if (name === undefined) return;
    const query = `UPDATE places SET name = ? WHERE place_id = ?`;
    db.prepare(query).run(name, place_id);
    console.log(`Place updated`);
}

function getPlaceById(place_id) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE place_id = ?`;
    return db.prepare(query).get(place_id);
}

function getPlaceByRobloxPlaceId(roblox_place_id) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE roblox_place_id = ?`;
    return db.prepare(query).get(roblox_place_id);
}

function getPlacesByExperienceId(experience_id, limit = 10) {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE experience_id = ? LIMIT ?`;
    return db.prepare(query).all(experience_id, limit);
}

module.exports = {
    createPlace,
    deletePlace,
    updatePlace,
    getPlaceById,
    getPlaceByRobloxPlaceId,
    getPlacesByExperienceId
};