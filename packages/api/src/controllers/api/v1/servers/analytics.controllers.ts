import { NotImplemented } from "@lib/api-response";
import { Request, Response } from "express";

async function getAnalytics(req: Request, res: Response) {
  return res.status(501).json(NotImplemented());
}

export default {
  getAnalytics,
};
