const usersService = require('@services/users.services');
const db = require('@services/sqlite.services');
const bcrypt = require('bcrypt');

describe('Users Service', () => {
    describe('createUser', () => {
        it('should create a new user and return it', () => {
            const username = 'John';
            const email = 'john.doe@mail.com';
            const password = 'password';

            const user = usersService.createUser(username, email, password);

            const userId = 1;
            expect(user).toHaveProperty('id');
            expect(user.id).toBe(userId);

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
        it('should delete the user and return true', () => {
            const userId = 1;
            const result = usersService.deleteUser(userId);

            expect(result).toBeTruthy();
        });

        it('should return false if no user exists', () => {
            const userId = 1337;
            const result = usersService.deleteUser(userId);

            expect(result).not.toBeTruthy();
        });
    });

    describe('updateUser', () => {
        let userId;
        beforeAll(() => {
            // Create a new user to modify
            const username = 'Mary';
            const email = 'mary.jane@mail.com';
            const password = 'password';

            const user = usersService.createUser(username, email, password);
            userId = user.id;
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
});
