const usersService = require('@services/users.services');

async function login(req, res) {
    // TODO: Login with email or username
    const { username, email, password } = req.body;
    try {
        const user = await usersService.validateCredentials(username, password);
        if (!user) {
            return res.status(401).json({
                code: 401,
                status: 'error',
                data: {
                    message: 'Invalid credentials'
                }
            });
        }

        // Store user info in session
        req.session.user = { id: user.id, username: user.username };

        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                message: 'Login successful'
            }
        });
    } catch(error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            code: 500,
            status: 'error',
            data: {
                message: 'Login failed unexpectedly'
            }
        });
    }
}

async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        const usersWithUsername = await usersService.getUsersByUsername(username);
        if (usersWithUsername?.length > 0) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                data: {
                    message: 'Username already in use'
                }
            });
        }

        const usersWithEmail = await usersService.getUsersByEmail(email);
        if (usersWithEmail?.length > 0) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                data: {
                    message: 'Email already in use'
                }
            });
        }
        
        // email & username
        const userInfo = await usersService.createUser(username, email, password);

        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                message: 'Registration successful',
                userInfo: userInfo
            }
        });
    } catch(error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            code: 500,
            status: 'error',
            data: {
                message: 'Registration failed unexpectedly'
            }
        });
    }
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({
                code: 500,
                status: 'error',
                data: {
                    message: 'Logout failed unexpectedly'
                }
            });
        }
        res.clearCookie('refreshToken');
        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                message: 'Logout successful'
            }
        });
    });
}

function verify(req, res) {
    const message = req.body;
    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: Object.keys(message).length ? message : 'verified'
        }
    });
}

module.exports = {
    login,
    register,
    logout,
    verify,
}