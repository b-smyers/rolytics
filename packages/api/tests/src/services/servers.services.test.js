const usersService = require('@services/users.services');
const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');
const serversService = require('@services/servers.services');
const db = require('@services/sqlite.services');

describe('Servers Service', () => {
    const username = 'Marty';
    const email = 'marty.mcfly@mail.com';
    const password = '88MilesPerHour';
    let userId;
    const robloxExperienceId = 3;
    const experienceName = 'Back to the future';
    let experienceId;
    const robloxPlaceId = 6;
    const placeName = 'The first movie';
    let placeId;
    beforeAll(() => {
        // Create a user
        userId = usersService.createUser(username, email, password).id;

        // Create an experience
        experienceId = experiencesService.createExperience(robloxExperienceId, userId, experienceName, '', 'example.com', '');

        // Create a place
        placeId = placesService.createPlace(robloxPlaceId, experienceId, placeName);
    });

    afterAll(() => {
        // Delete user, cascade all
        usersService.deleteUser(userId); 
    });

    describe('createServer', () => {
        let serverId;
        afterAll(() => {
            // Delete the server
            serversService.deleteServer(serverId);
        });

        it('should create a server and return its id', () => {
            const robloxServerId = 'cafe-face';
            const name = 'funky-zebra';
    
            serverId = serversService.createServer(robloxServerId, placeId, name);
            expect(serverId).toBe(1);

            const server = serversService.getServerById(serverId);
            expect(server).toHaveProperty('roblox_server_id');
            expect(server.roblox_server_id).toBe(robloxServerId);
            expect(server).toHaveProperty('place_id');
            expect(server.place_id).toBe(placeId);
            expect(server).toHaveProperty('name');
            expect(server.name).toBe(name);
        });
    });
    
    describe('deleteServer', () => {
        let serverId;
        beforeAll(() => {
            // Create the server to test
            const robloxServerId = '1111-ffff';
            const name = 'creative-otter';
            serverId = serversService.createServer(robloxServerId, placeId, name);
        });

        it('should delete the server and return true', () => {
            const result = serversService.deleteServer(serverId);

            expect(result).toBe(true);
        });

        it('should return false if no server exists', () => {
            const result = serversService.deleteServer(serverId);

            expect(result).toBe(false);
        });
    });

    describe('updateServer', () => {
        let serverId;
        beforeAll(() => {
            // Create the server to test
            const robloxServerId = '1212-3434';
            const name = 'ecstatic-cheetah';
            serverId = serversService.createServer(robloxServerId, placeId, name);
        });

        afterAll(() => {
            // Delete the server
            serversService.deleteServer(serverId);
        });

        it('should update the name', () => {
            const name = 'tangy-squirrel';
            serversService.updateServer(serverId, { name });

            const server = serversService.getServerById(serverId);
            expect(server.name).toBe(name);
        });

        it('should update the active status (true)', () => {
            const active = true;
            serversService.updateServer(serverId, { active });

            const server = serversService.getServerById(serverId);
            expect(server.active).toBe(active ? 1 : 0);
        });

        it('should update the active status (false)', () => {
            const active = false;
            serversService.updateServer(serverId, { active });

            const server = serversService.getServerById(serverId);
            expect(server.active).toBe(active ? 1 : 0);
        });
    });
});