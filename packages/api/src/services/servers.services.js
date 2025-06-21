const db = require('@services/sqlite.services');
const logger = require('@services/logger.services');

function createServer(roblox_server_id, place_id, name) {
    const query = `INSERT INTO servers (roblox_server_id, place_id, name) VALUES (?, ?, ?)`;
    const result = db.prepare(query).run(roblox_server_id, place_id, name);
    logger.info(`Server '${name}' created with Roblox Server ID ${roblox_server_id} and Place ID ${place_id}`);
    return result.lastInsertRowid;
}

function deleteServer(server_id) {
    const query = `DELETE FROM servers WHERE server_id = ?`;
    const result = db.prepare(query).run(server_id);

    if (result.changes > 0) {
        logger.info(`Server ID ${server_id} deleted`);
    } else {
        logger.warn(`Attempted to delete non-existent server with ID ${server_id}`);
    }

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
    
    if (updates.length === 0) {
        logger.warn(`No updates provided for server ID ${server_id}`);
        return
    };
    
    const query = `UPDATE servers SET ${updates.join(', ')} WHERE server_id = ?`;
    values.push(server_id);
    db.prepare(query).run(...values);
    logger.info(`Server with ID ${server_id} updated with fields: [${updates.map(u => u.split(' ')[0]).join(', ')}]`);
}

function getServerById(server_id) {
    const query = `SELECT * FROM servers WHERE server_id = ?`;
    const server = db.prepare(query).get(server_id);
    
    if (server) {
        logger.info(`Fetched server with ID ${server_id}`);
    } else {
        logger.warn(`No server found with ID ${server_id}`);
    }

    return server;
}

function getServerByRobloxServerIdAndPlaceId(roblox_server_id, place_id) {
    const query = `SELECT * FROM servers WHERE roblox_server_id = ? AND place_id = ?`;
    const server = db.prepare(query).get(roblox_server_id, place_id);

    if (server) {
        logger.info(`Fetched server with Roblox Server ID ${roblox_server_id} and Place ID ${place_id}`);
    } else {
        logger.warn(`No server found with Roblox Server ID ${roblox_server_id} and Place ID ${place_id}`);
    }

    return server;
}

function getServersByPlaceId(place_id, limit = 10) {
    const query = `SELECT * FROM servers WHERE place_id = ? LIMIT ?`;
    const servers = db.prepare(query).all(place_id, limit);

    logger.info(`Fetched ${servers.length} server(s) for Place ID ${place_id} with limit ${limit}`);

    return servers;
}

module.exports = {
    createServer,
    deleteServer,
    updateServer,
    getServerById,
    getServerByRobloxServerIdAndPlaceId,
    getServersByPlaceId
};