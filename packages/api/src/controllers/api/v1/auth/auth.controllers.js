const usersdb = require('@services/users.services');

async function login(req, res) {
    // TODO: Login with email or username
    const { username, email, password } = req.body;
    try {
        const user = await usersdb.loginUser(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store user info in session
        req.session.user = { id: user.id, username: user.username };

        res.json({ success: true });
    } catch(error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}

async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        const existingUser = await usersdb.findExistingAccounts(username, email);
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already in use' });
        }
        
        // email & username
        const userInfo = await usersdb.registerUser(username, email, password);

        res.status(201).json(userInfo);
    } catch(error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('refreshToken');
        res.json({ success: true });
    });
}

function verify(req, res) {
    const message = req.body;
    res.status(200).json(Object.keys(message).length ? message : 'verified');
}

module.exports = {
    login,
    register,
    logout,
    verify,
}