import { Router } from 'express';

import { getPlaceDetails } from '@controllers/api/v1/roblox/roblox.controllers';

const router = Router();

router.post('/place-details', getPlaceDetails);

export default router;