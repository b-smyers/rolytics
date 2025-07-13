import { Request, Response } from "express";

async function getAnalytics(req: Request, res: Response) {
    res.status(501).json({ message: 'Route not implemented' });
}

const analyticsController = {
    getAnalytics,
}

export default analyticsController;