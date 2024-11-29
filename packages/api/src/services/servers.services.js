const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function writePayload(payload) {
    const {
        purchases,
        performance,
        social,
        players,
        metadata
    } = payload;

    const experienceId = metadata.game.id;
    const serverId = metadata.server.id;
    const timestamp = metadata.timestamp || new Date();

    const query = `INSERT INTO analytics 
        (experience_id, server_id, timestamp, purchases, performance, social, players, metadata) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    try {
        await db.run(query, [
            experienceId, 
            serverId, 
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

async function getServerMetrics(serverId) {
    const query = `SELECT * FROM analytics WHERE server_id = ? LIMIT 10`;

    try {
        const result = await db.all(query, [serverId]);

        const parsedResult = result.map(row => ({
            ...row,
            purchases: JSON.parse(row.purchases),
            performance: JSON.parse(row.performance),
            social: JSON.parse(row.social),
            players: JSON.parse(row.players),
            metadata: JSON.parse(row.metadata)
        }));

        return parsedResult;
    } catch (error) {
        console.error(`An error occured getting server metrics: ${error.message}`);
    }
}

module.exports = {
    writePayload,
    getServerMetrics
}