import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/express";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const cookieToken = req.cookies?.token;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ message: "Authentication required. Please log in." });
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";
    const decoded = jwt.verify(token, jwtSecret) as AuthUser;

    req.user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid authentication token." });
  }
};

export const authMiddleware = authenticateToken;
export default authMiddleware;
