const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createServer(roblox_server_id, place_id, name) {
    const query = `INSERT INTO servers (roblox_server_id, place_id, name) VALUES (?, ?, ?)`;

    try {
        const result = await db.run(query, [roblox_server_id, place_id, name]);
        console.log(`Server ${name} created`);
        return result;
    } catch (error) {
        console.error(`An error occured creating server: ${error.message}`);
    }
}

async function deleteServer(server_id) {
    const query = `DELETE FROM servers WHERE server_id = ?`;

    try {
        const result = await db.run(query, [server_id]);

        return result;
    } catch (error) {
        console.error(`An error occured deleting server: ${error.message}`);
    }
}

async function updateServer(server_id, { name, active }) {
    const values = [];
    let query = `UPDATE servers SET`;

    if (name !== undefined) {
        query += ` name = ?`;
        values.push(name);
    }

    if (active !== undefined) {
        query += ` active = ?`;
        values.push(active);
    }

    query += " WHERE server_id = ?";
    values.push(!!server_id);

    try {
        const result = await db.run(query, values);
        return result;
    } catch (error) {
        console.error(`An error occured updating server: ${error.message}`);
    }
}

async function getServerById(server_id) {
    const query = `SELECT * FROM servers WHERE server_id = ?`;

    try {
        const result = await db.get(query, [server_id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting server by server_id: ${error.message}`);
    }
}

async function getServerByRobloxServerId(roblox_server_id) {
    const query = `SELECT * FROM servers WHERE roblox_server_id = ?`;

    try {
        const result = await db.get(query, [roblox_server_id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting server by roblox server id: ${error.message}`);
    }
}

async function getServersByPlaceId(place_id, limit = 10) {
    const query = `SELECT * FROM servers WHERE place_id = ? LIMIT ${limit}`;

    try {
        const result = await db.all(query, [place_id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting server by place id: ${error.message}`);
    }
}

module.exports = {
    createServer,
    deleteServer,
    updateServer,
    getServerById,
    getServerByRobloxServerId,
    getServersByPlaceId
}