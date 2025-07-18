import { Unauthorized, OK, InternalServerError, NotImplemented, BadRequest } from "@lib/api-response";
import { LoginBody, LoginWithUsername, LogoutBody, RegisterBody, VerifyBody } from "types/controllers/auth";
import { Request, Response } from "express";
import usersService from "services/users.services";
import settingsService from 'services/settings.services';


function isLoginWithUsername(body: LoginBody): body is LoginWithUsername {
    return typeof (body as LoginWithUsername).username === 'string';
}

function login(req: Request<{}, {}, LoginBody>, res: Response) {
    const body = req.body;
    
    if (isLoginWithUsername(body)) {
        try {
            const user = usersService.validateCredentials(body.username, body.password);
            if (!user) {
                return res.status(401).json(Unauthorized('Invalid Credentials'));
            }
            
            req.session.user = { id: user.id, username: user.username };
            
            const settings = settingsService.getSettings(user.id);
            
            return res.status(200).json(OK('Login successful', { settings }));
        } catch (error) {
            return res.status(500).json(InternalServerError('Login failed unexpectedly'));
        }
    } else {
        // TODO: Login with email
        return res.status(501).json(NotImplemented());
    }
}

function register(req: Request<{}, {}, RegisterBody>, res: Response) {
    const { username, email, password } = req.body;

    try {
        const usersWithUsername = usersService.getUsersByUsername(username);
        if (usersWithUsername?.length > 0) {
            return res.status(400).json(BadRequest('Username already in use'));
        }

        const usersWithEmail = usersService.getUsersByEmail(email);
        if (usersWithEmail?.length > 0) {
            return res.status(400).json(BadRequest('Email already in use'));
        }

        // email & username
        const userInfo = usersService.createUser(username, email, password);


        return res.status(200).json(OK('Registration successful', { userInfo }));
    } catch (error) {
        return res.status(500).json(InternalServerError('Registration failed unexpectedly'));
    }
}

function logout(req: Request<{}, {}, LogoutBody>, res: Response) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json(InternalServerError('Logout failed unexpectedly'));
        }
        res.clearCookie('refreshToken');
        return res.status(200).json(OK('Logout successful'));
    });
}

function verify(req: Request<{}, {}, VerifyBody>, res: Response) {
    const { message } = req.body || 'verified';
    return res.status(200).json(OK(message));
}

export default {
    login,
    register,
    logout,
    verify,
};