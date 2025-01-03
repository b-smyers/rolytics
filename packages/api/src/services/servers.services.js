const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createServer(roblox_server_id, place_id, name) {
    const query = `INSERT INTO servers (roblox_server_id, place_id, name) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(query, [roblox_server_id, place_id, name], function (error) {
            if (error) {
                console.error(`An error occured creating server: ${error.message}`);
                reject(error);
            }
            console.log(`Server ${name} created`);
            resolve(this.lastID);
        });
    });
}

async function deleteServer(server_id) {
    const query = `DELETE FROM servers WHERE server_id = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [server_id], function (error) {
            if (error) {
                console.error(`An error occured deleting server: ${error.message}`);
                reject(error);
            }
            console.log(`Server deleted`);
            resolve();
        });
    });
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
        values.push(!!active);
    }

    query += " WHERE server_id = ?";
    values.push(server_id);

    return new Promise((resolve, reject) => {
        db.run(query, values, function (error) {
            if (error) {
                console.error(`An error occured updating server: ${error.message}`);
                reject(error);
            }
            console.log(`Server updated`);
            resolve();
        });
    });
}

async function getServerById(server_id) {
    const query = `SELECT * FROM servers WHERE server_id = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [server_id], function (error, row) {
            if (error) {
                console.error(`An error occured getting server by id: ${error.message}`);
                reject(error);
            }
            resolve(row);
        });
    });
}

async function getServerByRobloxServerId(roblox_server_id) {
    const query = `SELECT * FROM servers WHERE roblox_server_id = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [roblox_server_id], function (error, row) {
            if (error) {
                console.error(`An error occured getting server by roblox server id: ${error.message}`);
                reject(error);
            }
            resolve(row);
        });
    });
}

async function getServersByPlaceId(place_id, limit = 10) {
    const query = `SELECT * FROM servers WHERE place_id = ? LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [place_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting server by place id: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        });
    });
}

module.exports = {
    createServer,
    deleteServer,
    updateServer,
    getServerById,
    getServerByRobloxServerId,
    getServersByPlaceId
}