import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        team: true,
      },
    });

    const formattedUsers = users.map(user => {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.username);
      return {
        ...user,
        username: isUUID ? (user.email.split("@")[0]) : user.username
      };
    });

    res.json(formattedUsers);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      profilePictureUrl = "i1.jpg",
      teamId = 1,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password || "changeme", 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profilePictureUrl,
        teamId: Number(teamId),
      },
    });
    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { username, email, profilePictureUrl, teamId } = req.body;
  try {
    let targetUserId = Number(userId);

    // If userId is not a number (e.g. Cognito UUID), find user by email
    if (isNaN(targetUserId)) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        targetUserId = user.userId;
      } else {
        // Option 2: Create the user if they don't exist yet (Lazy sync)
        const newUser = await prisma.user.create({
          data: {
            username,
            email,
            password: "cognito-managed",
            profilePictureUrl,
            teamId: teamId ? Number(teamId) : 1,
          }
        });
        res.json({ message: "User profile created successfully", updatedUser: newUser });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        userId: targetUserId,
      },
      data: {
        username,
        email,
        profilePictureUrl,
        teamId: teamId ? Number(teamId) : undefined,
      },
      include: {
        team: true,
      },
    });
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: `Error updating user: ${error.message}` });
  }
};
