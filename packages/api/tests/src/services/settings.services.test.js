const usersService = require('@services/users.services');
const settingsService = require('@services/settings.services');
const schema = require('@schemas/settings.schemas.json');

describe('Settings Service', () => {
    describe('getSettings', () => {
        let userId;
        beforeAll(() => {
            // Create user to test
            const username = 'Brendan';
            const email = 'brendan.smyers@mail.com';
            const password = 'super_secure_password';
            const user = usersService.createUser(username, email, password);
            userId = user.id;
        })

        afterAll(() => {
            // Delete created users
            usersService.deleteUser(userId);
        });
        
        it('should return an empty settings object when user has not changed their settings', () => {
            const settings = settingsService.getSettings(userId);

            expect(settings).toEqual({});
        });

        it('should return a settings object if the user has changed their settings', () => {
            const changedSettings = {
                theme: schema.theme.default,
                currency: schema.currency.default,
                abbreviateUserCounts: schema.abbreviateUserCounts.default
            }
            settingsService.setSettings(userId, changedSettings);

            const settings = settingsService.getSettings(userId);

            expect(settings).toHaveProperty('theme');
            expect(settings.theme).toBe(changedSettings.theme);
            expect(settings).toHaveProperty('currency');
            expect(settings.currency).toBe(changedSettings.currency);
            expect(settings).toHaveProperty('abbreviateUserCounts');
            expect(settings.abbreviateUserCounts).toBe(changedSettings.abbreviateUserCounts);
        });
    });

    describe('setSettings', () => {
        let userId;
        beforeAll(() => {
            // Create a new user to test
            const username = 'Mary';
            const email = 'mary.jane@mail.com';
            const password = 'password';

            const user = usersService.createUser(username, email, password);
            userId = user.id;
        });

        afterAll(() => {
            // Delete the user
            usersService.deleteUser(userId);
        });

        it('should set the users settings to the new settings', () => {
            const changedSettings = {
                theme: schema.theme.allowedValues[1],
                currency: schema.currency.allowedValues[1],
                abbreviateUserCounts: false
            }
            settingsService.setSettings(userId, changedSettings);

            const settings = settingsService.getSettings(userId);

            expect(settings).toHaveProperty('theme');
            expect(settings.theme).toBe(changedSettings.theme);
            expect(settings).toHaveProperty('currency');
            expect(settings.currency).toBe(changedSettings.currency);
            expect(settings).toHaveProperty('abbreviateUserCounts');
            expect(settings.abbreviateUserCounts).toBe(changedSettings.abbreviateUserCounts);
        });
    });
});
