const request = require("supertest");
const http = require("http");
const app = require("@api/app").default;

describe('Integration Tests', () => {
    const apiBaseUrl = '/api/v1';
    const authBaseUrl = apiBaseUrl + '/auth';
    const experiencesBaseUrl = apiBaseUrl + '/experiences';

    beforeEach((done) => {
        // Create test account
        request(app)
            .post(authBaseUrl + '/register')
            .send({ username: 'user1', email: 'user1@example.com', password: 'password' })
            .then(() => done());
    })

    describe('Smoke Test', () => {
        let httpServer;
        beforeAll((done) => {
            httpServer = http.createServer(app);

            // Capture any unhandled exceptions or warnings
            process.once('uncaughtException', (error) => done(error));
            process.once('unhandledRejection', (error) => done(error));

            httpServer.listen(process.env.HTTP_PORT, () => {
                done();
            });
        });

        afterAll((done) => {
            httpServer.close(done);
        });

        it('should start without errors or warnings', (done) => {
            done();
        });
    });

    describe('Auth', () => {
        describe('POST /register', () => {
            it('should return 200 and register successfully', async () => {
                await request(app)
                    .post(authBaseUrl + '/register')
                    .send({ username: 'test', email: 'test@example.com', password: 'test' })
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 200,
                            status: 'success',
                            data: {
                                message: 'Registration successful',
                                userInfo: expect.objectContaining({
                                    id: expect.any(Number),
                                    username: 'test',
                                    email: 'test@example.com'
                                })
                            }
                        });
                    });
            });

            it('should return 400 for existing username', async () => {
                await request(app)
                    .post(authBaseUrl + '/register')
                    .send({
                        username: 'test',
                        email: 'another@example.com',
                        password: 'test',
                    })
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 400,
                            status: 'error',
                            data: {
                                message: 'Username already in use',
                            }
                        });
                    });
            });

            it('should return 400 for existing email', async () => {
                await request(app)
                    .post(authBaseUrl + '/register')
                    .send({
                        username: 'another',
                        email: 'test@example.com',
                        password: 'test',
                    })
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 400,
                            status: 'error',
                            data: {
                                message: 'Email already in use',
                            }
                        });
                    });
            });
        });

        describe('POST /login', () => {
            it('should return 200 and login successfully', async () => {
                await request(app)
                    .post(authBaseUrl + '/login')
                    .send({ username: 'test', password: 'test' })
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 200,
                            status: 'success',
                            data: {
                                message: 'Login successful',
                                settings: expect.any(Object)
                            }
                        });
                    });
            });

            it('should return 401 for invalid credentials', async () => {
                await request(app)
                    .post(authBaseUrl + '/login')
                    .send({ username: 'test', password: 'notPassword' })
                    .expect(401)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 401,
                            status: 'error',
                            data: {
                                message: 'Invalid Credentials'
                            }
                        });
                    });
            });
        });


        describe('POST /logout', () => {
            it('should return 200 and logout successfully', async () => {
                await request(app)
                    .post(authBaseUrl + '/logout')
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 200,
                            status: 'success',
                            data: {
                                message: 'Logout successful'
                            }
                        });
                    });
            });
        });

        describe('POST /verify', () => {
            it('should return 200 and verify successfully with message', async () => {
                await request(app)
                    .post(authBaseUrl + '/login')
                    .send({ username: 'user1', password: 'password' })
                await request(app)
                    .post(authBaseUrl + '/verify')
                    .send("hello, world")
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 200,
                            status: 'success',
                            data: {
                                message: 'Logout successful'
                            }
                        });
                    });
            });

            it('should return 200 and verify successfully without message', async () => {
                await request(app)
                    .post(authBaseUrl + '/verify')
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual({
                            code: 200,
                            status: 'success',
                            data: {
                                message: 'Logout successful'
                            }
                        });
                    });
            });
        });
    });

    describe('Experiences', () => {
        describe('GET /', () => {
        });
        describe('POST /connect', () => {
        });
        describe('POST /disconnect', () => {
        });
        describe('GET /analytics', () => {
        });
        describe('GET /performance', () => {
        });
        describe('GET /players', () => {
        });
        describe('GET /purchases', () => {
        });
        describe('GET /social', () => {
        });
    });
});
