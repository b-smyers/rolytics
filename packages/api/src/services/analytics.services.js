const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createAnalytics(server_id, timestamp = new Date(), purchases, performance, social, players, metadata) {
    const query = `INSERT INTO analytics (server_id, timestamp, purchases, performance, social, players, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    return new Promise((resolve, reject) => {
        db.run(query, [
            server_id, 
            timestamp, 
            JSON.stringify(purchases),
            JSON.stringify(performance), 
            JSON.stringify(social), 
            JSON.stringify(players), 
            JSON.stringify(metadata)
        ], function (error) {
            if (error) {
                console.error(`An error occured creating analytics: ${error.message}`);
                reject(error);
            }
            console.log(`Payload data logged`);
            resolve(this.lastID);
        });
    });
}

async function deleteAnalytics(id) {
    const query = `DELETE FROM analytics WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [id], function (error) {
            if (error) {
                console.error(`An error occured deleting analytics: ${error.message}`);
                reject(error);
            }
            console.log(`Analytics deleted`);
            resolve();
        });
    });
}

async function getAnalyticById(id) {
    const query = `SELECT * FROM analytics WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [id], function (error, row) {
            if (error) {
                console.error(`An error occured getting analytics by id: ${error.message}`);
                reject(error);
            }
            resolve(row);
        });
    });
}

async function getPerformanceMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT performance FROM analytics WHERE server_id = ? LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [server_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting performance metrics by server id: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        })
    });
}

async function getPurchasesMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT purchases FROM analytics WHERE server_id = ? LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [server_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting pruchases metrics by server id: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        })
    });
}

async function getSocialMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT social FROM analytics WHERE server_id = ? LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [server_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting social metrics by server id: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        })
    });
}

async function getPlayersMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT players FROM analytics WHERE server_id = ? LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [server_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting players metrics by server id: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        })
    });
}

async function getMetadataMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT metadata FROM analytics WHERE server_id = ? LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [server_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting metadata metrics by server id: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        })
    });
}

module.exports = {
    createAnalytics,
    deleteAnalytics,
    getAnalyticById,
    getPerformanceMetricsByServerId,
    getPurchasesMetricsByServerId,
    getSocialMetricsByServerId,
    getPlayersMetricsByServerId,
    getMetadataMetricsByServerId
}