import { Router } from 'express';

import { getExperiences, connectExperience, disconnectExperience } from '@controllers/api/v1/experiences/experiences.controllers';
import { getAnalytics } from '@controllers/api/v1/experiences/analytics.controllers';
import { getPerformance } from '@controllers/api/v1/experiences/performance.controllers';
import { getPlayers } from '@controllers/api/v1/experiences/players.controllers';
import { getPurchases } from '@controllers/api/v1/experiences/purchases.controllers';
import { getSocial } from '@controllers/api/v1/experiences/social.controllers';

const router = Router();

router.get('/', getExperiences);
router.post('/connect', connectExperience);
router.post('/disconnect', disconnectExperience);

router.get('/analytics', getAnalytics);
router.get('/performance', getPerformance);
router.get('/players', getPlayers);
router.get('/purchases', getPurchases);
router.get('/social', getSocial);

export default router;