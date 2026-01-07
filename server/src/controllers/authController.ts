import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, profilePictureUrl, teamId } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profilePictureUrl,
        teamId: teamId ? Number(teamId) : undefined,
      },
    });

    res.status(201).json({ message: "User registered successfully", userId: user.userId });
  } catch (error: any) {
    res.status(500).json({ message: `Error registering user: ${error.message}` });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        userId: user.userId,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
        teamId: user.teamId,
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const getUserMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: req.user.userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ message: `Error fetching user: ${error.message}` });
  }
};
