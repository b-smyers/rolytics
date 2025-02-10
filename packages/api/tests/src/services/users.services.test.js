const usersService = require('@services/users.services');
const db = require('@services/sqlite.services');
const bcrypt = require('bcrypt');

describe('Users Service', () => {
    describe('createUser', () => {
        let userId;
        afterAll(() => {
            // Delete created users
            usersService.deleteUser(userId);
        });
        
        it('should create a new user and return it', () => {
            const username = 'John';
            const email = 'john.doe@mail.com';
            const password = 'password';

            const user = usersService.createUser(username, email, password);

            expect(user).toHaveProperty('id');
            expect(user.id).toBe(1);
            userId = user.id;

            expect(user).toHaveProperty('username');
            expect(user.username).toBe(username);

            expect(user).toHaveProperty('email')
            expect(user.email).toBe(email);
        });

        it('should create an api key for new accounts', () => {
            const user = usersService.getUserById(1);

            expect(user).toHaveProperty('api_key');
            expect(user.api_key).not.toBeNull();
        })
    });

    describe('deleteUser', () => {
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

        it('should delete the user and return true', () => {
            const result = usersService.deleteUser(userId);

            expect(result).toBe(true);
        });

        it('should return false if no user exists', () => {
            const result = usersService.deleteUser(userId);

            expect(result).toBe(false);
        });
    });

    describe('updateUser', () => {
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

        it('should update the username', () => {
            const username = 'Michael';
            usersService.updateUser(userId, { username });

            const user = usersService.getUserById(userId);
            expect(user.username).toBe(username);
        });

        it('should update the email', () => {
            const email = 'michael.jackson@mail.com';
            usersService.updateUser(userId, { email });

            const user = usersService.getUserById(userId);
            expect(user.email).toBe(email);
        });

        it('should update the password', async () => {
            const query = `SELECT password FROM users WHERE id = ?`;
            const preparedQuery = db.prepare(query);
            
            const previousPassword = preparedQuery.get(userId).password;
            const password = '123456789';
        
            await usersService.updateUser(userId, { password });
        
            const newPassword = preparedQuery.get(userId).password;
        
            const isMatch = bcrypt.compareSync(password, newPassword);
            
            expect(previousPassword).not.toBe(newPassword);
            expect(isMatch).toBe(true);
        });
        

        it('should update the api key', () => {
            const api_key = 'some-jwt-hash';
            usersService.updateUser(userId, { api_key });

            const user = usersService.getUserById(userId);
            expect(user.api_key).toBe(api_key);
        });
    });

    describe('validateCredentials', () => {
        let userId;
        let username = 'Billie';
        let email = 'billie.jean@mail.com';
        let password = 'password123';
        beforeAll(() => {
            // Create user to test
            const user = usersService.createUser(username, email, password);
            userId = user.id;
        });

        afterAll(() => {
            // Delete the user
            usersService.deleteUser(userId);
        });

        it('should return user id, email, and username if credentials are correct', () => {
            const result = usersService.validateCredentials(username, password);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('id');
            expect(result.id).toBe(userId);

            expect(result).toHaveProperty('email');
            expect(result.email).toBe(email);

            expect(result).toHaveProperty('username');
            expect(result.username).toBe(username);
        });

        it('should return false if username is wrong', () => {
            const incorrectUsername = 'wrongUsername';
            const result = usersService.validateCredentials(incorrectUsername, password);

            expect(result).toBe(false);
        });

        it('should return false if password is wrong', () => {
            const incorrectPassword = 'wrongPassword';
            const result = usersService.validateCredentials(username, incorrectPassword);

            expect(result).toBe(false);
        });
    });
});
