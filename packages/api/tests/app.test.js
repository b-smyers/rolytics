const request = require('supertest');
const http = require('http');
const app = require('@api/app').default;

describe('Integration Tests', () => {
    const apiBaseUrl = '/api/v1';
    const authBaseUrl = apiBaseUrl + '/auth';
    
    
    describe('Startup', () => {
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

            });
            it('should return 400 for existing email', async () => {

            });
        });

        describe('POST /login', () => {
            it('should return 200 and login successfully', async () => {

            });
            it('should return 401 for invalid credentials', async () => {

            });
        });


        describe('POST /logout', () => {
            it('should return 200 and logout successfully', async () => {

            });
        });

        describe('POST /verify', () => {
            it('should return 200 and verify successfully with message', async () => {

            });
            it('should return 200 and verify successfully without message', async () => {

            });
        });
    });
});
