import { Router } from 'express';

import { getServers, openServer, closeServer } from '@controllers/api/v1/servers/servers.controllers';
import { logData } from '@controllers/api/v1/servers/data.controllers';
import { getAnalytics } from '@controllers/api/v1/servers/analytics.controllers';
import { getPerformance } from '@controllers/api/v1/servers/performance.controllers';
import { getPlayers } from '@controllers/api/v1/servers/players.controllers';
import { getPurchases } from '@controllers/api/v1/servers/purchases.controllers';
import { getSocial } from '@controllers/api/v1/servers/social.controllers';

const router = Router();

router.get('/', getServers);
router.post('/open', openServer);
router.post('/close', closeServer);
router.post('/data', logData);

router.get('/analytics', getAnalytics);
router.get('/performance', getPerformance);
router.get('/players', getPlayers);
router.get('/purchases', getPurchases);
router.get('/social', getSocial);

export default router;