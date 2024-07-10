const jwt = require('jsonwebtoken');
const usersdb = require('../services/users.services');

async function login(req, res) {
    const { username, email, password } = req.body;
    try {
        const user = await usersdb.loginUser(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT access token
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1hr' });

        // Generate JWT refresh token
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Set refreshToken in secure browser cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return access token
        res.json({
            accessToken: accessToken
        });
    } catch(error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Registration failed' });
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
    res.status(501).json({ message: 'Logout not implemented' });
}

function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }
  
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }
    
        const accessToken = jwt.sign({ userId: decoded.userId }, JWT_ACCESS_SECRET, { expiresIn: '1hr' });
    
        res.json({ accessToken });
    });
}

function verify(req, res) {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <TOKEN>

    if (!token) {
        return res.status(403);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401);
        }
        req.userId = decoded.id;
    });
}

module.exports = {
    login,
    register,
    logout,
    refresh,
    verify,
}