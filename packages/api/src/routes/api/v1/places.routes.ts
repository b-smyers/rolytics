import { Router } from 'express';

import { getPlaces } from '@controllers/api/v1/places/places.controllers';
import { getAnalytics } from '@controllers/api/v1/places/analytics.controllers';
import { getPerformance } from '@controllers/api/v1/places/performance.controllers';
import { getPlayers } from '@controllers/api/v1/places/players.controllers';
import { getPurchases } from '@controllers/api/v1/places/purchases.controllers';
import { getSocial } from '@controllers/api/v1/places/social.controllers';

const router = Router();

router.get('/', getPlaces);
router.get('/analytics', getAnalytics);
router.get('/performance', getPerformance);
router.get('/players', getPlayers);
router.get('/purchases', getPurchases);
router.get('/social', getSocial);

export default router;