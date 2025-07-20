const usersService = require('@services/users.services').default;
const experiencesService = require('@services/experiences.services').default;
const placesService = require('@services/places.services').default;
const serversService = require('@services/servers.services').default;
const metricsService = require('@services/metrics.services').default;

describe('Metrics Service', () => {
    const username = 'testuser';
    const email = `${username}@mail.com`;
    const password = 'testpass';
    let userId;
    const robloxExperienceId = '3';
    const experienceName = 'Test Experience';
    let experienceId;
    const robloxPlaceId = '6';
    const placeName = 'Test Place';
    let placeId;
    const robloxServerId = '9';
    const serverName = 'test-server';
    let serverId;

    // Example data
    const timestamp = Date.now();
    const data = {
        purchases: { data: "Purchase data" },
        performance: { data: "Performance data" },
        social: { data: "Social data" },
        players: { data: "Players data" },
        metadata: { data: "Metadata" },
    }

    beforeAll(() => {
        // Create a user
        userId = usersService.createUser(username, email, password).id;

        // Create an experience
        experienceId = experiencesService.createExperience(robloxExperienceId, userId, experienceName, '', 'example.com', '');

        // Create a place
        placeId = placesService.createPlace(robloxPlaceId, experienceId, placeName);

        // Create a server
        serverId = serversService.createServer(robloxServerId, placeId, serverName);
    });

    afterAll(() => {
        // Delete user, cascade all
        usersService.deleteUser(userId); 
    });

    describe('createMetrics', () => {
        let metricId;
        afterAll(() => {
            // Delete the metric
            metricsService.deleteMetric(metricId);
        });

        it('should create a metric and return its id', () => {
            metricId = metricsService.createMetric(
                serverId,
                timestamp,
                data.purchases,
                data.performance,
                data.social,
                data.players,
                data.metadata
            );
            expect(metricId).toBe(1);

            const metric = metricsService.getMetricById(metricId);
            expect(metric).toHaveProperty('timestamp');
            expect(metric.timestamp).toEqual(timestamp);
            expect(metric).toHaveProperty('server_id');
            expect(metric.server_id).toEqual(serverId);
            // Check metrics
            expect(metric).toHaveProperty('purchases');
            expect(metric.purchases).toEqual(data.purchases);
            expect(metric).toHaveProperty('performance');
            expect(metric.performance).toEqual(data.performance);
            expect(metric).toHaveProperty('social');
            expect(metric.social).toEqual(data.social);
            expect(metric).toHaveProperty('players');
            expect(metric.players).toEqual(data.players);
            expect(metric).toHaveProperty('metadata');
            expect(metric.metadata).toEqual(data.metadata);
        });
    });
    
    describe('deleteMetric', () => {
        let metricId;
        beforeAll(() => {
            // Create the metric to test
            metricId = metricsService.createMetric(
                serverId,
                timestamp,
                data.purchases,
                data.performance,
                data.social,
                data.players,
                data.metadata
            );
        });

        it('should delete the metric and return true', () => {
            const result = metricsService.deleteMetric(metricId);

            expect(result).toBe(true);
        });

        it('should return false if no metric exists', () => {
            const result = metricsService.deleteMetric(metricId);

            expect(result).toBe(false);
        });
    });
});