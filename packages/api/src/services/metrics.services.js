const db = require('@services/sqlite.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
const logger = require('@services/logger.services');

const aggregateSchema = require('@schemas/aggregate.schemas.json');

function createMetric(server_id, timestamp = Date.now(), purchases, performance, social, players, metadata) {
    const query = `INSERT INTO metrics (server_id, timestamp, purchases, performance, social, players, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = db.prepare(query).run(
        server_id,
        timestamp,
        JSON.stringify(purchases),
        JSON.stringify(performance),
        JSON.stringify(social),
        JSON.stringify(players),
        JSON.stringify(metadata)
    );
    logger.info(`Metric created for server ID ${server_id} at timestamp ${timestamp}`);
    return result.lastInsertRowid;
}

function deleteMetric(id) {
    const query = `DELETE FROM metrics WHERE server_id = ?`;
    const result = db.prepare(query).run(id);

    if (result.changes > 0) {
        logger.info(`Metrics deleted for server ID ${id}`);
    } else {
        logger.warn(`Attempted to delete non-existent metrics for server ID ${id}`);
    }

    return result.changes != 0;
}

function getMetricById(id) {
    const query = `SELECT timestamp, server_id, purchases, performance, social, players, metadata FROM metrics WHERE server_id = ?`;
    const metric = db.prepare(query).get(id);

    if (metric) {
        logger.info(`Fetched metric for server ID ${id}`);
    } else {
        logger.warn(`No metric found for server ID ${id}`);
    }

    return metric;
}

function getMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT timestamp, server_id, purchases, performance, social, players, metadata FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
    const metrics = db.prepare(query).all(server_id, limit);
    logger.info(`Fetched ${metrics.length} metrics for server ID ${server_id} with limit ${limit}`);
    return metrics;
}

function getPerformanceMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT performance FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
    const metrics = db.prepare(query).all(server_id, limit);
    logger.info(`Fetched ${metrics.length} performance metrics for server ID ${server_id}`);
    return metrics;
}

function getPurchasesMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT purchases FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
    const metrics = db.prepare(query).all(server_id, limit);
    logger.info(`Fetched ${metrics.length} purchase metrics for server ID ${server_id}`);
    return metrics;
}

function getSocialMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT social FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
    const metrics = db.prepare(query).all(server_id, limit);
    logger.info(`Fetched ${metrics.length} social metrics for server ID ${server_id}`);
    return metrics;
}

function getPlayersMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT players FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
    const metrics = db.prepare(query).all(server_id, limit);
    logger.info(`Fetched ${metrics.length} player metrics for server ID ${server_id}`);
    return metrics;
}

function getMetadataMetricsByServerId(server_id, limit = 20) {
    const query = `SELECT metadata FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
    const metrics = db.prepare(query).all(server_id, limit);
    logger.info(`Fetched ${metrics.length} metadata metrics for server ID ${server_id}`);
    return metrics;
}

function aggregatePlaceMetrics(place_id, server_limit = 100) {
    logger.info(`Aggregating metrics for Place ID ${place_id} (server limit: ${server_limit})`);
    const servers = serversService.getServersByPlaceId(place_id, server_limit);
    const metrics = servers.flatMap(server => getMetricsByServerId(server.server_id, 100));
    
    const aggregatedMetrics = {};
    for (const [metricType, schema] of Object.entries(aggregateSchema)) {
        if (metricType === 'metadata') continue;
        const aggregatedData = {};
        
        for (const [metric, { aggregation }] of Object.entries(schema)) {
            let valuesByTimestamp = {};
            metrics.forEach(({ timestamp, [metricType]: metricData }) => {
                const parsedMetrics = JSON.parse(metricData);
                valuesByTimestamp[timestamp] = valuesByTimestamp[timestamp] || [];
                valuesByTimestamp[timestamp].push(parsedMetrics[metric]);
            });
            
            for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
                aggregatedData[timestamp] = aggregatedData[timestamp] || {};
                aggregatedData[timestamp][metric] = aggregation === 'sum' 
                    ? values.reduce((acc, val) => acc + val, 0) 
                    : values.reduce((acc, val) => acc + val, 0) / values.length;
            }
        }
        aggregatedMetrics[metricType] = Object.entries(aggregatedData).map(([timestamp, metrics]) => ({ timestamp: parseFloat(timestamp), ...metrics }));
    }
    
    const query = `UPDATE places SET purchases = ?, performance = ?, social = ?, players = ?, last_computed_at = ? WHERE place_id = ?`;
    db.prepare(query).run(
        JSON.stringify(aggregatedMetrics.purchases) || '',
        JSON.stringify(aggregatedMetrics.performance) || '',
        JSON.stringify(aggregatedMetrics.social) || '',
        JSON.stringify(aggregatedMetrics.players) || '',
        Date.now(),
        place_id
    );
    logger.info(`Aggregated metrics updated for Place ID ${place_id}`);
}

function aggregateExperienceMetrics(experience_id, place_limit = 100) {
    logger.info(`Aggregating metrics for Experience ID ${experience_id} (place limit: ${place_limit})`);
    const places = placesService.getPlacesByExperienceId(experience_id, place_limit);
    const aggregatedMetrics = {};
    
    for (const [metricType, schema] of Object.entries(aggregateSchema)) {
        if (metricType === 'metadata') continue;
        const aggregatedData = {};
        
        for (const [metric, { aggregation }] of Object.entries(schema)) {
            let valuesByTimestamp = {};
            places.forEach(place => {
                const metrics = JSON.parse(place[metricType]);
                if (!metrics) return;
                metrics.forEach(({ timestamp, [metric]: value }) => {
                    valuesByTimestamp[timestamp] = valuesByTimestamp[timestamp] || [];
                    valuesByTimestamp[timestamp].push(value);
                });
            });
            
            for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
                aggregatedData[timestamp] = aggregatedData[timestamp] || {};
                aggregatedData[timestamp][metric] = aggregation === 'sum' 
                    ? values.reduce((acc, val) => acc + val, 0) 
                    : values.reduce((acc, val) => acc + val, 0) / values.length;
            }
        }
        aggregatedMetrics[metricType] = Object.entries(aggregatedData).map(([timestamp, metrics]) => ({ timestamp: parseFloat(timestamp), ...metrics }));
    }
    
    const query = `UPDATE experiences SET purchases = ?, performance = ?, social = ?, players = ?, last_computed_at = ? WHERE experience_id = ?`;
    
    db.prepare(query).run(
        JSON.stringify(aggregatedMetrics.purchases) || '',
        JSON.stringify(aggregatedMetrics.performance) || '',
        JSON.stringify(aggregatedMetrics.social) || '',
        JSON.stringify(aggregatedMetrics.players) || '',
        Date.now(),
        experience_id
    );
    logger.info(`Aggregated metrics updated for Experience ID ${experience_id}`);
}

function deleteOldMetrics(milliseconds) {
    const cutoffMs = Date.now() - milliseconds;
    const query = `DELETE FROM metrics WHERE strftime('%s', created_at) * 1000 < ?`;
    const result = db.prepare(query).run(cutoffMs);
    logger.info(`Deleted ${result.changes} metric(s) older than ${milliseconds}ms`);
    return result.changes;
}

module.exports = {
    createMetric,
    deleteMetric,
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
};