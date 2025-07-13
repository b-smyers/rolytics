import { Router } from 'express';

import { authenticate } from '@middleware/auth.middleware';

import { login, register, logout, verify } from '@controllers/api/v1/auth/auth.controllers';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/verify', authenticate, verify);

export default router;
