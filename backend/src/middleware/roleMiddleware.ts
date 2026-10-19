import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userRole = (req.user.role || "").toLowerCase();
    const hasRole = allowedRoles.some((role) => role.toLowerCase() === userRole);

    if (!hasRole) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action.",
      });
    }

    return next();
  };
};
