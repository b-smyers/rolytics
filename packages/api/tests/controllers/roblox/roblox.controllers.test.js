const request = require("supertest");
const express = require("express");
const session = require("express-session");
const robloxController = require("@controllers/api/v1/roblox/roblox.controllers").default;

const app = express();
app.use(express.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.post('/api/v1/roblox/place-details', robloxController.getPlaceDetails);

describe('Roblox Controller', () => {
    // Mock robloxService methods
    const robloxService = require("@services/roblox.services").default;
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if placeId is missing', async () => {
        const res = await request(app)
            .post('/api/v1/roblox/place-details')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('code', 401);
        expect(res.body).toHaveProperty('status', 'error');
        expect(res.body.data).toHaveProperty('message', 'Missing placeId');
    });

    it('should return 404 if experienceId not found', async () => {
        robloxService.getExperienceIdfromPlaceId = jest.fn().mockRejectedValue(new Error('Not found'));
        const res = await request(app)
            .post('/api/v1/roblox/place-details')
            .send({ placeId: '12345' });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('code', 404);
        expect(res.body).toHaveProperty('status', 'error');
        expect(res.body.data).toHaveProperty('message', 'Experience not found');
    });

    it('should return 404 if experience details not found', async () => {
        robloxService.getExperienceIdfromPlaceId = jest.fn().mockResolvedValue('exp123');
        robloxService.getExperienceDetails = jest.fn().mockRejectedValue(new Error('Not found'));
        const res = await request(app)
            .post('/api/v1/roblox/place-details')
            .send({ placeId: '12345' });
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toHaveProperty('message', 'Experience details not found');
    });

    it('should return 404 if experience media not found', async () => {
        robloxService.getExperienceIdfromPlaceId = jest.fn().mockResolvedValue('exp123');
        robloxService.getExperienceDetails = jest.fn().mockResolvedValue({ name: 'Test', description: 'Desc' });
        robloxService.getExperienceMedia = jest.fn().mockRejectedValue(new Error('Not found'));
        const res = await request(app)
            .post('/api/v1/roblox/place-details')
            .send({ placeId: '12345' });
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toHaveProperty('message', 'Experience media not found');
    });

    it('should return 404 if experience images not found', async () => {
        robloxService.getExperienceIdfromPlaceId = jest.fn().mockResolvedValue('exp123');
        robloxService.getExperienceDetails = jest.fn().mockResolvedValue({ name: 'Test', description: 'Desc' });
        robloxService.getExperienceMedia = jest.fn().mockResolvedValue({ data: [{ imageId: 'img1' }] });
        robloxService.getMediaThumbnails = jest.fn().mockRejectedValue(new Error('Not found'));
        const res = await request(app)
            .post('/api/v1/roblox/place-details')
            .send({ placeId: '12345' });
        expect(res.statusCode).toBe(404);
        expect(res.body.data).toHaveProperty('message', 'Experience images not found');
    });

    it('should return 200 and place details if all data is found', async () => {
        robloxService.getExperienceIdfromPlaceId = jest.fn().mockResolvedValue('exp123');
        robloxService.getExperienceDetails = jest.fn().mockResolvedValue({ name: 'Test', description: 'Desc' });
        robloxService.getExperienceMedia = jest.fn().mockResolvedValue({ data: [{ imageId: 'img1' }, { imageId: 'img2' }] });
        robloxService.getMediaThumbnails = jest.fn().mockResolvedValue(['url1', 'url2']);
        const res = await request(app)
            .post('/api/v1/roblox/place-details')
            .send({ placeId: '12345' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('code', 200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data).toMatchObject({
            placeId: '12345',
            name: 'Test',
            description: 'Desc',
            experienceId: 'exp123',
            thumbnails: ['url1', 'url2']
        });
    });
});