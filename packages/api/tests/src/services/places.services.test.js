const usersService = require('@services/users.services');
const experiencesService = require('@services/experiences.services');
const placesService = require('@services/places.services');

describe('Places Service', () => {
    const username = 'Tony';
    const email = 'tony.stark@mail.com';
    const password = 'ironmaniscool';
    let userId;
    const robloxExperienceId = 3;
    const experienceName = 'Avengers Tower';
    let experienceId;
    beforeAll(() => {
        // Create a user
        userId = usersService.createUser(username, email, password).id;

        // Create an experience
        experienceId = experiencesService.createExperience(robloxExperienceId, userId, experienceName, '', 'example.com', '');
    });

    afterAll(() => {
        // Delete user, cascade all
        usersService.deleteUser(userId); 
    });

    describe('createPlace', () => {
        let placeId;
        afterAll(() => {
            // Delete the place
            placesService.deletePlace(placeId);
        });

        it('should create a place and return its id', () => {
            const robloxPlaceId = 'fade-code';
            const name = 'Xandar';
    
            placeId = placesService.createPlace(robloxPlaceId, experienceId, name);
            expect(placeId).toBe(1);

            const place = placesService.getPlaceById(placeId);
            expect(place).toHaveProperty('roblox_place_id');
            expect(place.roblox_place_id).toBe(robloxPlaceId);
            expect(place).toHaveProperty('name');
            expect(place.name).toBe(name);
        });
    });
    
    describe('deletePlace', () => {
        let placeId;
        beforeAll(() => {
            // Create the place to test
            const robloxPlaceId = 'bace-cade';
            const name = 'New York City';
            placeId = placesService.createPlace(robloxPlaceId, placeId, name);
        });

        it('should delete the place and return true', () => {
            const result = placesService.deletePlace(placeId);

            expect(result).toBe(true);
        });

        it('should return false if no place exists', () => {
            const result = placesService.deletePlace(placeId);

            expect(result).toBe(false);
        });
    });

    describe('updatePlace', () => {
        let placeId;
        beforeAll(() => {
            // Create the place to test
            const robloxPlaceId = '1337-1337';
            const name = 'Asgard';
            placeId = placesService.createPlace(robloxPlaceId, placeId, name);
        });

        afterAll(() => {
            // Delete the place
            placesService.deletePlace(placeId);
        });

        it('should update the name', () => {
            const name = 'Wakanda';
            placesService.updatePlace(placeId, { name });

            const place = placesService.getPlaceById(placeId);
            expect(place.name).toBe(name);
        });
    });
});