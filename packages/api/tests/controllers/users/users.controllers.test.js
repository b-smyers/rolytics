const request = require('supertest');
const express = require('express');
const session = require('express-session');
const usersController = require('@controllers/api/v1/users/users.controllers');
const usersService = require('@services/users.services');
const settingsService = require('@services/settings.services');
const schema = require('@schemas/settings.schemas.json');

jest.mock('@services/users.services');
jest.mock('@services/settings.services');

const app = express();
app.use(express.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
    req.user = { id: 1 };
    next();
});
app.get('/profile', usersController.getProfile);
app.get('/settings', usersController.getSettings);
app.post('/settings', usersController.updateSettings);

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('GET /profile', () => {
        it('should return 200 and the user profile', async () => {
            usersService.getUserById.mockReturnValue({
                id: 1,
                username: 'testuser',
                email: 'testuser@mail.com',
                api_key: 'API_KEY'
            });

            const res = await request(app)
                .get('/profile')
                .send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: { 
                    message: 'Profile retrieved successfully',
                    profile: {
                        id: 1,
                        username: 'testuser',
                        email: 'testuser@mail.com',
                        api_key: 'API_KEY'
                    }
                }
            });
        });

        it('should return 500 for server error', async () => {
            usersService.getUserById.mockImplementation(() => { throw new Error('Server error'); });

            const res = await request(app)
                .get('/profile')
                .send();

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({
                code: 500,
                status: 'error',
                data: { 
                    message: 'Failed to retrieve profile',
                }
            });
        });
    });

    describe('GET /settings', () => {
        it('should return 200 and the users settings', async () => {
            settingsService.getSettings.mockReturnValue({
                theme: schema.theme.default,
                currency: schema.currency.default,
                abbreviateUserCounts: schema.abbreviateUserCounts.default
            });

            const res = await request(app)
                .get('/settings')
                .send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: { 
                    message: 'Settings successfully retrieved',
                    settings: {
                        theme: schema.theme.default,
                        currency: schema.currency.default,
                        abbreviateUserCounts: schema.abbreviateUserCounts.default
                    }
                }
            });
        });

        it('should return 500 for server error', async () => {
            settingsService.getSettings.mockImplementation(() => { throw new Error('Server error'); });

            const res = await request(app)
                .get('/settings')
                .send();

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({
                code: 500,
                status: 'error',
                data: { 
                    message: 'Failed to retrieve settings'
                }
            });
        });
    });
    describe('POST /settings', () => {
        it('should return 200 and update user settings', async () => {
            settingsService.updateSettings.mockReturnValue(true);

            const res = await request(app)
                .post('/settings')
                .send({
                    settings: {
                        theme: schema.theme.default,
                        currency: schema.currency.default,
                        abbreviateUserCounts: schema.abbreviateUserCounts.default
                    }
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: { 
                    message: 'Settings updated successfully'
                }
            });
        });

        it('should return 400 for unknown setting key', async () => {
            const res = await request(app)
                .post('/settings')
                .send({
                    settings: {
                        unknownKey: 'value'
                    }
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
                code: 400,
                status: 'error',
                data: { 
                    message: 'Unknown setting: unknownKey'
                }
            });
        });

        it('should return 400 for invalid setting key type', async () => {
            const res = await request(app)
                .post('/settings')
                .send({
                    settings: {
                        theme: 123 // should be a string
                    }
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
                code: 400,
                status: 'error',
                data: { 
                    message: 'Invalid type for theme: expected string'
                }
            });
        });

        it('should return 400 for non-allowed setting value', async () => {
            const res = await request(app)
                .post('/settings')
                .send({
                    settings: {
                        theme: 'invalidTheme' // not in allowed values
                    }
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
                code: 400,
                status: 'error',
                data: { 
                    message: `Invalid value for theme: allowed values are ${schema.theme.allowedValues.join(', ')}`
                }
            });
        });

        it('should return 500 for server error', async () => {
            settingsService.updateSettings.mockImplementation(() => { throw new Error('Server error'); });

            const res = await request(app)
                .post('/settings')
                .send({
                    settings: {
                        theme: schema.theme.default,
                        currency: schema.currency.default,
                        abbreviateUserCounts: schema.abbreviateUserCounts.default
                    }
                });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({
                code: 500,
                status: 'error',
                data: { 
                    message: 'Failed to update settings'
                }
            });
        });
    });
});