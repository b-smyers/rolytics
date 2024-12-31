const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createAnalytics(server_id, timestamp = new Date(), purchases, performance, social, players, metadata) {
    const query = `INSERT INTO analytics 
        (server_id, timestamp, purchases, performance, social, players, metadata) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    try {
        await db.run(query, [
            server_id, 
            timestamp, 
            JSON.stringify(purchases),
            JSON.stringify(performance), 
            JSON.stringify(social), 
            JSON.stringify(players), 
            JSON.stringify(metadata)
        ]);
        console.log('Payload data logged');
    } catch (error) {
        console.error(`An error occured writing payload: ${error.message}`);
    }
}

async function deleteAnalytics(id) {
    const query = `DELETE FROM analytics WHERE id = ?`;

    try {
        const result = await db.run(query, [id]);

        return result;
    } catch (error) {
        console.error(`An error occured deleting analytics: ${error.message}`);
    }
}

async function getAnalyticById(id) {
    const query = `SELECT * FROM analytics WHERE id = ?`;

    try {
        const result = await db.get(query, [id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting analytics by id: ${error.message}`);
    }
}

async function getAnalyticsByServerId(server_id, limit = 20) {
    const query = `SELECT * FROM analytics WHERE server_id = ? LIMIT ${limit}`;

    try {
        const result = await db.all(query, [server_id]);

        return result;
    } catch (error) {
        console.error(`An error occured getting analytics by server id: ${error.message}`);
    }
}

module.exports = {
    createAnalytics,
    deleteAnalytics,
    getAnalyticById,
    getAnalyticsByServerId
}