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
    
    // 1. Find or create user in local database
    let localUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    const friendlyName = payload["cognito:username"] || payload.username || payload.email.split("@")[0];

    if (!localUser) {
      localUser = await prisma.user.create({
        data: {
          username: friendlyName,
          email: payload.email,
          password: "cognito-managed",
        },
      });
    } else {
      // If the existing username is a UUID, update it to something readable
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(localUser.username);
      if (isUUID) {
        localUser = await prisma.user.update({
          where: { userId: localUser.userId },
          data: { username: friendlyName }
        });
      }
    }

    req.user = {
      userId: localUser.userId, // Numerical ID
      username: localUser.username, // Readable name
      email: localUser.email,
    };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
