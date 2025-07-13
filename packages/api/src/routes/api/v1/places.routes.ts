import { Router } from 'express';

import placesController from '@controllers/api/v1/places/places.controllers';
import analyticsController from '@controllers/api/v1/places/analytics.controllers';
import performanceController from '@controllers/api/v1/places/performance.controllers';
import playersController from '@controllers/api/v1/places/players.controllers';
import purchasesController from '@controllers/api/v1/places/purchases.controllers';
import socialController from '@controllers/api/v1/places/social.controllers';

const router = Router();

router.get('/', placesController.getPlaces);
router.get('/analytics', analyticsController.getAnalytics);
router.get('/performance', performanceController.getPerformance);
router.get('/players', playersController.getPlayers);
router.get('/purchases', purchasesController.getPurchases);
router.get('/social', socialController.getSocial);

export default router;