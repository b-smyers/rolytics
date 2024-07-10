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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/api/auth/refresh',
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
    const cookieHeader = req.headers.cookie;
    let refreshToken;

    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
        const myCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

        if (myCookie) {
            refreshToken = myCookie.split('=')[1];
        }
    }

    if (!refreshToken) {
        console.log('Missing refresh token in refresh');
        return res.status(401).json({ message: 'Refresh token not provided' });
    }
  
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            console.log('Invalid refresh token in refresh');
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1hr' });
    
        res.json({ accessToken });
    });
}

function verify(req, res) {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <TOKEN>

    if (!token) {
        return res.status(403).json({ message: 'Access token not provided' });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid access token' });
        }
        req.userId = decoded.userId;
    });
    res.status(200);
}

module.exports = {
    login,
    register,
    logout,
    refresh,
    verify,
}