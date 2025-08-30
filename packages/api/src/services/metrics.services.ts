import db from "@services/sqlite.services";
import placesService from "@services/places.services";
import serversService from "@services/servers.services";
import logger from "@services/logger.services";
import aggregateSchema from "@schemas/aggregate.schemas.json";
import {
  DBMetadataMetric,
  DBMetric,
  DBPerformanceMetric,
  DBPlayersMetric,
  DBPurchasesMetric,
  DBSocialMetric,
  Metadata,
  MetadataMetric,
  Metric,
  Performance,
  PerformanceMetric,
  Players,
  PlayersMetric,
  Purchases,
  PurchasesMetric,
  Social,
  SocialMetric,
} from "types/metrics";

function createMetric(
  server_id: number,
  timestamp: number = Date.now(),
  purchases: Purchases,
  performance: Performance,
  social: Social,
  players: Players,
  metadata: Metadata,
): number {
  const query = `INSERT INTO metrics (server_id, timestamp, purchases, performance, social, players, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const result = db
    .prepare(query)
    .run(
      server_id,
      timestamp,
      JSON.stringify(purchases),
      JSON.stringify(performance),
      JSON.stringify(social),
      JSON.stringify(players),
      JSON.stringify(metadata),
    );
  logger.info(
    `Metric created for server ID '${server_id}' at timestamp '${timestamp}'`,
  );
  return result.lastInsertRowid as number;
}

function deleteMetric(id: number): boolean {
  const query = `DELETE FROM metrics WHERE server_id = ?`;
  const result = db.prepare(query).run(id);

  if (result.changes > 0) {
    logger.info(`Metrics deleted for server ID '${id}'`);
  } else {
    logger.warn(
      `Attempted to delete non-existent metrics for server ID '${id}'`,
    );
  }

  return result.changes !== 0;
}

function getMetricById(server_id: number): Metric | undefined {
  const query = `SELECT timestamp, server_id, purchases, performance, social, players, metadata FROM metrics WHERE server_id = ?`;
  const metric = db.prepare(query).get(server_id) as DBMetric | undefined;

  if (metric) {
    logger.info(`Fetched metric for server ID '${server_id}'`);

    const parsedMetric: Metric = {
      timestamp: metric.timestamp,
      server_id: metric.server_id,
      purchases: JSON.parse(metric.purchases),
      performance: JSON.parse(metric.performance),
      social: JSON.parse(metric.social),
      players: JSON.parse(metric.players),
      metadata: JSON.parse(metric.metadata),
    };

    return parsedMetric;
  } else {
    logger.warn(`No metric found for server ID '${server_id}'`);
    return;
  }
}

function getMetricsByServerId(
  server_id: number,
  limit = 20,
): Metric[] | undefined {
  const query = `SELECT timestamp, server_id, purchases, performance, social, players, metadata FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
  const metrics = db.prepare(query).all(server_id, limit) as
    | DBMetric[]
    | undefined;

  if (metrics) {
    logger.info(
      `Fetched ${metrics.length} metrics for server ID '${server_id}' with limit ${limit}`,
    );

    const parsedMetrics: Metric[] = metrics.map((metric) => ({
      timestamp: metric.timestamp,
      server_id: metric.server_id,
      purchases: JSON.parse(metric.purchases),
      performance: JSON.parse(metric.performance),
      social: JSON.parse(metric.social),
      players: JSON.parse(metric.players),
      metadata: JSON.parse(metric.metadata),
    }));

    return parsedMetrics;
  } else {
    logger.info(`No metrics found for server ID '${server_id}'`);
    return;
  }
}

function getPerformanceMetricsByServerId(
  server_id: number,
  limit = 20,
): PerformanceMetric[] | undefined {
  const query = `SELECT timestamp, server_id, performance FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
  const metrics = db.prepare(query).all(server_id, limit) as
    | DBPerformanceMetric[]
    | undefined;

  if (metrics) {
    logger.info(
      `Fetched ${metrics.length} performance metrics for server ID '${server_id}'`,
    );

    const parsedMetrics: PerformanceMetric[] = metrics.map((metric) => ({
      timestamp: metric.timestamp,
      server_id: metric.server_id,
      performance: JSON.parse(metric.performance) as Performance,
    }));

    return parsedMetrics;
  } else {
    logger.info(`No performance metrics found for server ID '${server_id}'`);
    return;
  }
}

function getPurchasesMetricsByServerId(
  server_id: number,
  limit = 20,
): PurchasesMetric[] | undefined {
  const query = `SELECT timestamp, server_id, purchases FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
  const metrics = db.prepare(query).all(server_id, limit) as
    | DBPurchasesMetric[]
    | undefined;

  if (metrics) {
    logger.info(
      `Fetched ${metrics.length} purchase metrics for server ID '${server_id}'`,
    );

    const parsedMetrics: PurchasesMetric[] = metrics.map((metric) => ({
      timestamp: metric.timestamp,
      server_id: metric.server_id,
      purchases: JSON.parse(metric.purchases) as Purchases,
    }));

    return parsedMetrics;
  } else {
    logger.info(`No purchase metrics found for server ID '${server_id}'`);
    return;
  }
}

function getSocialMetricsByServerId(
  server_id: number,
  limit = 20,
): SocialMetric[] | undefined {
  const query = `SELECT timestamp, server_id, social FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
  const metrics = db.prepare(query).all(server_id, limit) as
    | DBSocialMetric[]
    | undefined;

  if (metrics) {
    logger.info(
      `Fetched ${metrics.length} social metrics for server ID '${server_id}'`,
    );

    const parsedMetrics: SocialMetric[] = metrics.map((metric) => ({
      timestamp: metric.timestamp,
      server_id: metric.server_id,
      social: JSON.parse(metric.social) as Social,
    }));

    return parsedMetrics;
  } else {
    logger.info(`No social metrics found for server ID '${server_id}'`);
    return;
  }
}

function getPlayersMetricsByServerId(
  server_id: number,
  limit = 20,
): PlayersMetric[] | undefined {
  const query = `SELECT timestamp, server_id, players FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
  const metrics = db.prepare(query).all(server_id, limit) as
    | DBPlayersMetric[]
    | undefined;

  if (metrics) {
    logger.info(
      `Fetched ${metrics.length} player metrics for server ID '${server_id}'`,
    );

    const parsedMetrics: PlayersMetric[] = metrics.map((metric) => ({
      timestamp: metric.timestamp,
      server_id: metric.server_id,
      players: JSON.parse(metric.players) as Players,
    }));

    return parsedMetrics;
  } else {
    logger.info(`No player metrics found for server ID '${server_id}'`);
    return;
  }
}

function getMetadataMetricsByServerId(
  server_id: number,
  limit = 20,
): MetadataMetric[] | undefined {
  const query = `SELECT timestamp, server_id, metadata FROM metrics WHERE server_id = ? ORDER BY timestamp DESC LIMIT ?`;
  const metrics = db.prepare(query).all(server_id, limit) as
    | DBMetadataMetric[]
    | undefined;

  if (metrics) {
    logger.info(
      `Fetched ${metrics.length} metadata metrics for server ID '${server_id}'`,
    );

    const parsedMetrics: MetadataMetric[] = metrics.map((metric) => ({
      timestamp: metric.timestamp,
      server_id: metric.server_id,
      metadata: JSON.parse(metric.metadata) as Metadata,
    }));

    return parsedMetrics;
  } else {
    logger.info(`No metadata metrics found for server ID '${server_id}'`);
    return;
  }
}

function aggregatePlaceMetrics(place_id: number, server_limit = 100): void {
  logger.info(
    `Aggregating metrics for Place ID '${place_id}' (server limit: ${server_limit})`,
  );
  const servers = serversService.getServersByPlaceId(
    place_id,
    server_limit,
  ) as { server_id: number }[];
  const metrics = servers.flatMap((server) =>
    getMetricsByServerId(server.server_id, 100),
  );

  const aggregatedMetrics: Record<string, any> = {};
  for (const [metricType, schema] of Object.entries(
    aggregateSchema as Record<string, any>,
  )) {
    if (metricType === "metadata") continue;
    const aggregatedData: Record<string, any> = {};

    for (const [metric, schemaEntry] of Object.entries(
      schema as Record<string, { aggregation: string }>,
    )) {
      const valuesByTimestamp: Record<string, any[]> = {};
      metrics.forEach((metricRow: any) => {
        const timestamp = metricRow.timestamp;
        const metricData = metricRow[metricType];
        if (!metricData) return;
        const parsedMetrics = JSON.parse(metricData);
        valuesByTimestamp[timestamp] = valuesByTimestamp[timestamp] || [];
        valuesByTimestamp[timestamp].push(parsedMetrics[metric]);
      });

      for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
        aggregatedData[timestamp] = aggregatedData[timestamp] || {};
        aggregatedData[timestamp][metric] =
          schemaEntry.aggregation === "sum"
            ? values.reduce((acc, val) => acc + val, 0)
            : values.reduce((acc, val) => acc + val, 0) / values.length;
      }
    }
    aggregatedMetrics[metricType] = Object.entries(aggregatedData).map(
      ([timestamp, metrics]) => ({
        timestamp: parseFloat(timestamp),
        ...metrics,
      }),
    );
  }

  const query = `UPDATE places SET purchases = ?, performance = ?, social = ?, players = ?, last_computed_at = ? WHERE place_id = ?`;
  db.prepare(query).run(
    JSON.stringify(aggregatedMetrics.purchases) || "",
    JSON.stringify(aggregatedMetrics.performance) || "",
    JSON.stringify(aggregatedMetrics.social) || "",
    JSON.stringify(aggregatedMetrics.players) || "",
    Date.now(),
    place_id,
  );
  logger.info(`Aggregated metrics updated for Place ID '${place_id}'`);
}

function aggregateExperienceMetrics(
  experience_id: number,
  place_limit = 100,
): void {
  logger.info(
    `Aggregating metrics for Experience ID '${experience_id}' (place limit: ${place_limit})`,
  );
  const places = placesService.getPlacesByExperienceId(
    experience_id,
    place_limit,
  ) as Record<string, any>[];
  const aggregatedMetrics: Record<string, any> = {};

  for (const [metricType, schema] of Object.entries(
    aggregateSchema as Record<string, any>,
  )) {
    if (metricType === "metadata") continue;
    const aggregatedData: Record<string, any> = {};

    for (const [metric, schemaEntry] of Object.entries(
      schema as Record<string, { aggregation: string }>,
    )) {
      const valuesByTimestamp: Record<string, any[]> = {};
      places.forEach((place: any) => {
        const metricData = place[metricType];
        if (!metricData) return;
        const metricsArr = JSON.parse(metricData);
        if (!metricsArr) return;
        metricsArr.forEach((entry: any) => {
          const timestamp = entry.timestamp;
          const value = entry[metric];
          valuesByTimestamp[timestamp] = valuesByTimestamp[timestamp] || [];
          valuesByTimestamp[timestamp].push(value);
        });
      });

      for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
        aggregatedData[timestamp] = aggregatedData[timestamp] || {};
        aggregatedData[timestamp][metric] =
          schemaEntry.aggregation === "sum"
            ? values.reduce((acc, val) => acc + val, 0)
            : values.reduce((acc, val) => acc + val, 0) / values.length;
      }
    }
    aggregatedMetrics[metricType] = Object.entries(aggregatedData).map(
      ([timestamp, metrics]) => ({
        timestamp: parseFloat(timestamp),
        ...metrics,
      }),
    );
  }

  const query = `UPDATE experiences SET purchases = ?, performance = ?, social = ?, players = ?, last_computed_at = ? WHERE experience_id = ?`;

  db.prepare(query).run(
    JSON.stringify(aggregatedMetrics.purchases) || "",
    JSON.stringify(aggregatedMetrics.performance) || "",
    JSON.stringify(aggregatedMetrics.social) || "",
    JSON.stringify(aggregatedMetrics.players) || "",
    Date.now(),
    experience_id,
  );
  logger.info(
    `Aggregated metrics updated for Experience ID '${experience_id}'`,
  );
}

function deleteOldMetrics(milliseconds: number): number {
  const cutoffMs = Date.now() - milliseconds;
  const query = `DELETE FROM metrics WHERE strftime('%s', created_at) * 1000 < ?`;
  const result = db.prepare(query).run(cutoffMs);
  logger.info(
    `Deleted ${result.changes} metric(s) older than ${milliseconds}ms`,
  );
  return result.changes;
}

const metricsService = {
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
  deleteOldMetrics,
};

export default metricsService;
