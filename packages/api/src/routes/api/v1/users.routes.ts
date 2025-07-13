import { Router } from 'express';
import { getProfile, getSettings, updateSettings } from '@controllers/api/v1/users/users.controllers';

const router = Router();

router.get('/profile', getProfile);
router.get('/settings', getSettings);
router.post('/settings', updateSettings);

export default router;
