const http = require('http');
const app = require('@api/app');

describe('Server', () => {
  let httpServer;

    beforeAll((done) => {
        httpServer = http.createServer(app);
        
        // Capture any unhandled exceptions or warnings
        process.once('uncaughtException', (error) => {
            done(error);
        });

        process.once('unhandledRejection', (error) => {
            done(error);
        });

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
