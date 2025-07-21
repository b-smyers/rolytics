import { Request, Response, NextFunction } from "express";
import { Unauthorized } from "@lib/api-response";
import jwt from "jsonwebtoken";

const checkSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json(Unauthorized("Session expired"));
  }
};

const checkJWTToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(Unauthorized("Token missing"));
  }
  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (token) {
    // Verify JWT token
    jwt.verify(
      token,
      process.env.JWT_API_KEY_SECRET,
      { algorithms: ["HS256"] },
      (err: any, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json(Unauthorized("Token expired"));
          }
          return res.status(401).json(Unauthorized("Token invalid"));
        }

        req.user = decoded;
        next();
      },
    );
  } else {
    return res.status(401).json(Unauthorized("Token missing"));
  }
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["authorization"]) {
    // External request
    checkJWTToken(req, res, next);
  } else if (req.session?.user) {
    // Internal request
    checkSession(req, res, next);
  } else {
    res.status(401).json(Unauthorized());
  }
};

export { authenticate };
