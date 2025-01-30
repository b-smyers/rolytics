const getDatabase = require('@services/sqlite.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
let db;
(async function() { db = await getDatabase() })()

const aggregateSchema = require('@schemas/aggregate.schemas.json');

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

async function getMetricById(id) {
    const query = `SELECT timestamp, server_id, purchases, performance, social, players, metadata FROM analytics WHERE id = ?`;

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

async function getMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT timestamp, server_id, purchases, performance, social, players, metadata FROM analytics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ${limit}`;

    return new Promise((resolve, reject) => {
        db.all(query, [server_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting metrics by server id: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        });
    });
}

async function getPerformanceMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT performance FROM analytics WHERE server_id = ORDER BY timestamp DESC ? LIMIT ${limit}`;

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
    const query = `SELECT purchases FROM analytics WHERE server_id = ORDER BY timestamp DESC ? LIMIT ${limit}`;

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
    const query = `SELECT social FROM analytics WHERE server_id = ORDER BY timestamp DESC ? LIMIT ${limit}`;

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
    const query = `SELECT players FROM analytics WHERE server_id = ORDER BY timestamp DESC ? LIMIT ${limit}`;

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
    const query = `SELECT metadata FROM analytics WHERE server_id = ORDER BY timestamp DESC ? LIMIT ${limit}`;

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

async function aggregatePlaceMetrics(place_id, server_limit = 100) {
    console.log(`Place (${place_id}) data is stale, re-aggregating...`);
    const servers = await serversService.getServersByPlaceId(place_id, server_limit);
    const analytics = await Promise.all(
        servers.map(server => 
            getMetricsByServerId(server.server_id, 100)
        )
    );

    const aggregatedMetrics = {};
    
    for (const [metricType, schema] of Object.entries(aggregateSchema)) {
        // Exit if metadata
        if (metricType === 'metadata') continue;
    
        const aggregatedData = {};
    
        for (const [metric, { type, aggregation }] of Object.entries(schema)) {
            let valuesByTimestamp = {};
    
            // Group values by timestamp
            analytics.forEach(serverAnalytics => {
                serverAnalytics.forEach(a => {
                    const timestamp = a.timestamp;
                    if (!valuesByTimestamp[timestamp]) {
                        valuesByTimestamp[timestamp] = [];
                    }
                    const parsedMetrics = JSON.parse(a[metricType]);
                    valuesByTimestamp[timestamp].push(parsedMetrics[metric]);
                });
            });
    
            // Apply aggregation for each timestamp
            for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
                if (!aggregatedData[timestamp]) {
                    aggregatedData[timestamp] = {};
                }
                if (aggregation === 'sum') {
                    aggregatedData[timestamp][metric] = values.reduce((acc, val) => acc + val, 0);
                } else if (aggregation === 'average') {
                    aggregatedData[timestamp][metric] = values.reduce((acc, val) => acc + val, 0) / values.length;
                }
            }
        }
    
        // Transform aggregated data into the desired format
        aggregatedMetrics[metricType] = [];
        for (const [timestamp, metrics] of Object.entries(aggregatedData)) {
            const formattedMetrics = { timestamp: parseFloat(timestamp), ...metrics };
            aggregatedMetrics[metricType].push(formattedMetrics);
        }
    }

    const query = `UPDATE places SET purchases = ?, performance = ?, social = ?, players = ?, last_computed_at = ? WHERE place_id = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [
            JSON.stringify(aggregatedMetrics.purchases),
            JSON.stringify(aggregatedMetrics.performance), 
            JSON.stringify(aggregatedMetrics.social), 
            JSON.stringify(aggregatedMetrics.players),
            new Date(),
            place_id
        ], function (error) {
            if (error) {
                console.error(`An error occured updating aggregated metrics: ${error.message}`);
                reject(error);
            }
            resolve();
        });
    });
}

async function aggregateExperienceMetrics(experience_id, place_limit = 100) {
    console.log(`Experience (${experience_id}) data is stale, re-aggregating...`);
    const places = await placesService.getPlacesByExperienceId(experience_id, place_limit);

    const aggregatedMetrics = {};

    for (const [metricType, schema] of Object.entries(aggregateSchema)) {
        // Exit if metadata
        if (metricType === 'metadata') continue;

        const aggregatedData = {};

        for (const [metric, { type, aggregation }] of Object.entries(schema)) {
            let valuesByTimestamp = {};

            // Group values by timestamp
            places.forEach(place => {
                const metrics = JSON.parse(place[metricType]);
                if (!metrics) return;
                
                metrics.forEach(data => {
                const timestamp = data.timestamp;
                if (!valuesByTimestamp[timestamp]) {
                    valuesByTimestamp[timestamp] = [];
                }
                    valuesByTimestamp[timestamp].push(data[metric]);
                });
            });

            // Apply aggregation for each timestamp
            for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
                if (!aggregatedData[timestamp]) {
                    aggregatedData[timestamp] = {};
                }
                if (aggregation === 'sum') {
                    aggregatedData[timestamp][metric] = values.reduce((acc, val) => acc + val, 0);
                } else if (aggregation === 'average') {
                    aggregatedData[timestamp][metric] = values.reduce((acc, val) => acc + val, 0) / values.length;
                }
            }
        }

        // Transform aggregated data into the desired format
        aggregatedMetrics[metricType] = [];
        for (const [timestamp, metrics] of Object.entries(aggregatedData)) {
            const formattedMetrics = { timestamp: parseFloat(timestamp), ...metrics };
            aggregatedMetrics[metricType].push(formattedMetrics);
        }
    }

    const query = `UPDATE experiences SET purchases = ?, performance = ?, social = ?, players = ?, last_computed_at = ? WHERE experience_id = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [
            JSON.stringify(aggregatedMetrics.purchases),
            JSON.stringify(aggregatedMetrics.performance), 
            JSON.stringify(aggregatedMetrics.social), 
            JSON.stringify(aggregatedMetrics.players),
            new Date(),
            experience_id
        ], function (error) {
            if (error) {
                console.error(`An error occurred updating aggregated metrics: ${error.message}`);
                reject(error);
            }
            resolve();
        });
    });
}

/**
 * Deletes all metrics older than 'milliseconds' old
 * @param {number} milliseconds - The max metric age
 * @returns {Promise} SQLite3 database promise
 */
async function deleteOldMetrics(milliseconds) {
    const cutoffMs = Date.now() - milliseconds;
    const query = `DELETE FROM analytics WHERE strftime('%s', created_at) * 1000 < ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [cutoffMs], function (error) {
            if (error) {
                console.error(`An error occured deleting analytics: ${error.message}`);
                reject(error);
            }
            console.log(`Deleted ${this.changes} rows.`);
            resolve();
        });
    });
}

module.exports = {
    createAnalytics,
    deleteAnalytics,
    getMetricById,
    getMetricsByServerId,
    getPerformanceMetricsByServerId,
    getPurchasesMetricsByServerId,
    getSocialMetricsByServerId,
    getPlayersMetricsByServerId,
    getMetadataMetricsByServerId,
    aggregatePlaceMetrics,
    aggregateExperienceMetrics,
    deleteOldMetrics
}