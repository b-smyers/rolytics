const request = require("supertest");
const express = require("express");
const session = require("express-session");
const authController = require("@controllers/api/v1/auth/auth.controllers").default;
const usersService = require("@services/users.services").default;
const settingsService = require("@services/settings.services").default;

jest.mock("@services/users.services");
jest.mock("@services/settings.services");

// Add manual mocks for all used service functions
usersService.validateCredentials = jest.fn();
usersService.getUsersByUsername = jest.fn();
usersService.getUsersByEmail = jest.fn();
usersService.createUser = jest.fn();
settingsService.getSettings = jest.fn();

const app = express();
app.use(express.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.post('/login', authController.login);
app.post('/register', authController.register);
app.post('/logout', authController.logout);
app.post('/verify', authController.verify);

describe('Auth Controller', () => {
    let timestamp = Date.parse("2025-04-12T10:00:00Z");

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /login', () => {
        it('should return 200 and login successfully', async () => {
            usersService.validateCredentials.mockReturnValue({ id: 1, email: "testuser@mail.com", username: 'testuser' });
            settingsService.getSettings.mockReturnValue({ lastModified: timestamp /* other settings */ });

            const res = await request(app)
                .post("/login")
                .send({ username: 'testuser', password: 'password' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: {
                    message: 'Login successful',
                    settings: {
                        lastModified: timestamp
                    }
                }
            });
        });

        it('should return 401 for invalid credentials', async () => {
            usersService.validateCredentials.mockReturnValue(false);

            const res = await request(app)
                .post("/login")
                .send({ username: 'testuser', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({
                code: 401,
                status: 'error',
                data: { message: 'Invalid Credentials' }
            });
        });

        it('should return 500 for server error', async () => {
            usersService.validateCredentials.mockImplementation(() => { throw new Error("Server error"); });

            const res = await request(app)
                .post("/login")
                .send({ username: 'testuser', password: 'password' });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({
                code: 500,
                status: 'error',
                data: { message: 'Login failed unexpectedly' }
            });
        });
    });

    describe('POST /register', () => {
        it('should return 200 and register successfully', async () => {
            usersService.getUsersByUsername.mockReturnValue([]);
            usersService.getUsersByEmail.mockReturnValue([]);
            usersService.createUser.mockReturnValue({ id: 1, username: 'testuser', email: 'test@example.com' });

            const res = await request(app)
                .post("/register")
                .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: {
                    message: 'Registration successful',
                    userInfo: { id: 1, username: 'testuser', email: 'test@example.com' }
                }
            });
        });

        it('should return 400 for existing username', async () => {
            usersService.getUsersByUsername.mockReturnValue([{ id: 1, username: 'testuser' }]);

            const res = await request(app)
                .post("/register")
                .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
                code: 400,
                status: 'error',
                data: { message: 'Username already in use' }
            });
        });

        it('should return 400 for existing email', async () => {
            usersService.getUsersByUsername.mockReturnValue([]);
            usersService.getUsersByEmail.mockReturnValue([{ id: 1, email: 'test@example.com' }]);

            const res = await request(app)
                .post("/register")
                .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
                code: 400,
                status: 'error',
                data: { message: 'Email already in use' }
            });
        });

        it('should return 500 for server error', async () => {
            usersService.getUsersByUsername.mockImplementation(() => { throw new Error("Server error"); });

            const res = await request(app)
                .post("/register")
                .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({
                code: 500,
                status: 'error',
                data: { message: 'Registration failed unexpectedly' }
            });
        });
    });

    describe('POST /logout', () => {
        it('should return 200 and logout successfully', async () => {
            const res = await request(app)
                .post("/logout")
                .send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: { message: 'Logout successful' }
            });
        });

        it('should return 500 for server error during logout', async () => {
            jest.spyOn(session.Session.prototype, 'destroy').mockImplementation(function (callback) {
                callback(new Error("Server error"));
            });

            const res = await request(app)
                .post("/logout")
                .send();

            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual({
                code: 500,
                status: 'error',
                data: { message: 'Logout failed unexpectedly' }
            });
        });
    });

    describe('POST /verify', () => {
        it('should return 200 and verify successfully with message', async () => {
            const res = await request(app)
                .post("/verify")
                .send({ message: 'test message' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: { message: 'test message' }
            });
        });

        it('should return 200 and verify successfully without message', async () => {
            const res = await request(app)
                .post("/verify")
                .send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                code: 200,
                status: 'success',
                data: { message: 'OK' }
            });
        });
    });
});