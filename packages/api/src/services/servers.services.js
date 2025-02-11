const db = require('@services/sqlite.services');

function createServer(roblox_server_id, place_id, name) {
    const query = `INSERT INTO servers (roblox_server_id, place_id, name) VALUES (?, ?, ?)`;
    const result = db.prepare(query).run(roblox_server_id, place_id, name);
    console.log(`Server ${name} created`);
    return result.lastInsertRowid;
}

function deleteServer(server_id) {
    const query = `DELETE FROM servers WHERE server_id = ?`;
    const result = db.prepare(query).run(server_id);
    console.log(`Server deleted`);
    return result.changes != 0;
}

function updateServer(server_id, { name, active }) {
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
        updates.push(`name = ?`);
        values.push(name);
    }
    
    if (active !== undefined) {
        updates.push(`active = ?`);
        values.push(active ? 1 : 0);
    }
    
    if (updates.length === 0) return;
    
    const query = `UPDATE servers SET ${updates.join(', ')} WHERE server_id = ?`;
    values.push(server_id);
    db.prepare(query).run(...values);
    console.log(`Server updated`);
}

function getServerById(server_id) {
    const query = `SELECT * FROM servers WHERE server_id = ?`;
    return db.prepare(query).get(server_id);
}

function getServerByRobloxServerIdAndPlaceId(roblox_server_id, place_id) {
    const query = `SELECT * FROM servers WHERE roblox_server_id = ? AND place_id = ?`;
    return db.prepare(query).get(roblox_server_id, place_id);
}

function getServersByPlaceId(place_id, limit = 10) {
    const query = `SELECT * FROM servers WHERE place_id = ? LIMIT ?`;
    return db.prepare(query).all(place_id, limit);
}

module.exports = {
    createServer,
    deleteServer,
    updateServer,
    getServerById,
    getServerByRobloxServerIdAndPlaceId,
    getServersByPlaceId
};