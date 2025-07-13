const usersService = require('@services/users.services').default;
const settingsService = require('@services/settings.services').default;
const db = require('@services/sqlite.services').default;
const schema = require('@schemas/settings.schemas.json');

describe('Settings Service', () => {
    const defaultSettings = {
        theme: schema.theme.default,
        currency: schema.currency.default,
        abbreviateUserCounts: schema.abbreviateUserCounts.default,  
    }

    let timestamp1 = Date.parse('2025-04-12T10:00:00Z');
    let timestamp2 = Date.parse('2025-04-12T10:11:00Z');
    beforeEach(() => {
        const dateMock = jest.spyOn(Date, 'now');
        dateMock
            .mockReturnValueOnce(timestamp1)
            .mockReturnValueOnce(timestamp2);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createSettings', () => {
        let userId;
        beforeEach(() => {
            // Create user to test
            const query = `INSERT INTO users (username, email, password, api_key) VALUES (?, ?, ?, ?)`;

            const randomString = Math.random().toString(36).substring(7);

            const username = `testuser-${randomString}`;
            const email = `${username}@mail.com`;
            const password = 'testpass';
            const apiKey = `key-${randomString}`;
            const result = db.prepare(query).run(username, email, password, apiKey);
            userId = result.lastInsertRowid;

            // Reset mock
            Date.now.mockClear();
        });

        afterEach(() => {
            // Delete created user
            const query = `DELETE FROM users WHERE id = ?`;
            db.prepare(query).run(userId);
        });

        it('should save the default settings if none are provided', () => {
            settingsService.createSettings(userId); // Date.Now #1 

            const settings = settingsService.getSettings(userId);

            expect(settings).toEqual({
                ...defaultSettings,
                lastModified: timestamp1
            });
        });

        it('should save the modified settings if they are provided', () => {
            const modifiedSettings = {
                theme: schema.theme.allowedValues[1],
                currency: schema.currency.allowedValues[1],
                abbreviateUserCounts: schema.abbreviateUserCounts.allowedValues[1]
            }

            settingsService.createSettings(userId, modifiedSettings); // Date.Now #1

            const settings = settingsService.getSettings(userId);

            expect(settings).toEqual({
                ...modifiedSettings,
                lastModified: timestamp2
            });
        });

        it('should save the mix the modified settings along with defaults of others if they are not provided', () => {
            const modifiedSettings = {
                theme: schema.theme.allowedValues[1],
            }

            settingsService.createSettings(userId, modifiedSettings); // Date.Now #1

            const settings = settingsService.getSettings(userId);

            expect(settings).toEqual({
                ...defaultSettings,
                ...modifiedSettings,
                lastModified: timestamp1
            });
        });
    });

    describe('getSettings', () => {
        let userId;
        beforeAll(() => {
            // Create user to test
            const username = 'Brendan';
            const email = 'brendan.smyers@mail.com';
            const password = 'super_secure_password';
            const user = usersService.createUser(username, email, password); // Date.Now #1, calls c
            userId = user.id;
        });

        afterAll(() => {
            // Delete created users
            usersService.deleteUser(userId);
        });
        
        it('should return the default settings if the user has not changed them', () => {
            const settings = settingsService.getSettings(userId);

            expect(settings).toEqual({
                ...defaultSettings,
                lastModified: timestamp1
            });
        });

        it('should return the new settings if the user has changed them', () => {
            const changedSettings = {
                theme: schema.theme.allowedValues[1],
                currency: schema.currency.allowedValues[1],
                abbreviateUserCounts: schema.abbreviateUserCounts.allowedValues[1]
            }
            settingsService.updateSettings(userId, changedSettings);

            const settings = settingsService.getSettings(userId);

            expect(settings).toEqual({
                ...changedSettings,
                lastModified: timestamp2
            });
        });
    });

    describe('updateSettings', () => {
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
            settingsService.updateSettings(userId, changedSettings);

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
