import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
  tokenUse: "id", // or "access"
  clientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
});

export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = await verifier.verify(token) as any;
    
    // 1. Check if user exists in your local database
    let localUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    // 2. If they don't exist yet (first time login), create them!
    if (!localUser) {
      localUser = await prisma.user.create({
        data: {
          username: payload["cognito:username"] || payload.username || payload.email.split("@")[0],
          email: payload.email,
          password: "cognito-managed", // We use Cognito for password management
          // Removed hardcoded teamId to avoid FK errors
        },
      });
    }

    req.user = {
      userId: localUser.userId, // Use the real database Integer ID
      username: localUser.username,
      email: localUser.email,
    };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
