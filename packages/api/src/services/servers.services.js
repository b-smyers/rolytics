const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createServer(id, place_id, name) {
    const query = `INSERT INTO servers (id, place_id, name) VALUES (?, ?, ?)`;

    try {
        const result = await db.run(query, [id, place_id, name]);

        return result;
    } catch (error) {
        console.error(`An error occured creating server: ${error.message}`);
    }
}

async function deleteServer(id) {
    const query = `DELETE FROM servers WHERE id = ?`;

    try {
        const result = await db.run(query, [id]);

        return result;
    } catch (error) {
        console.error(`An error occured deleting server: ${error.message}`);
    }
}

async function updateServer(id, name) {
    const query = `UPDATE servers SET name = ? WHERE id = ?`;

    try {
        const result = await db.run(query, [name, id]);

        return result;
    } catch (error) {
        console.error(`An error occured updating server: ${error.message}`);
    }
}

async function getServerById(id) {
    const query = `SELECT * FROM servers WHERE id = ?`;

    try {
        const result = await db.get(query, [id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting server by id: ${error.message}`);
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
    getServersByPlaceId
}