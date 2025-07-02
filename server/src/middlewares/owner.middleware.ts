import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { authenticationServices } from "../services";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const parkerAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;
    const user = await authenticationServices.findUserById(userId);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    if (user.isBlocked) {
      res.status(403).json({ message: "User is blocked" });
      return;
    }
    if (user.isDeleted) {
      res.status(403).json({ message: "User is deleted" });
      return;
    }
    if (user.userVerification.isVerified === false) {
      res.status(403).json({ message: "User is not verified" });
      return;
    }
    if (user.role !== "owner") {
      res.status(403).json({ message: "User is not a owner" });
      return;
    }
    req.user = {
      userId: user._id,
      role: user.role,
    } as JwtPayload;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
