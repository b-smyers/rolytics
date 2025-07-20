import { NotFound, TooManyRequests } from '@lib/api-response';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import logger from '@services/logger.services';
import logTraffic from '@services/logTraffic.services';
import apiRoutes from '@routes/api/v1/api.routes';
import metricsService from '@services/metrics.services';

const app = express();
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // minutes
    limit: 90,               // requests / 1 min
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: TooManyRequests()
});
if (process.env.NODE_ENV !== 'development') {
    app.use(limiter);
}
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));
app.use(cookieParser());
app.use(logTraffic);

// Routes
app.use('/api/v1', apiRoutes);

// Serve custom 404
app.use('/api', (req: Request, res: Response) => {
    res.status(404).json(NotFound('Unknown endpoint'));
});

// Cleanup old metrics
if (process.env.NODE_ENV !== 'test') {
    cron.schedule(process.env.METRIC_CLEANUP_CRON as string, () => {
        logger.info(`Cleaning up old metrics...`);
        metricsService.deleteOldMetrics(process.env.METRIC_MAX_AGE as unknown as number);
        logger.info(`Old metrics cleaned up!`);
    });
}

export default app;
