import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        let productOwnerUsername = null;
        let projectManagerUsername = null;

        if (team.productOwnerUserId) {
          const productOwner = await prisma.user.findUnique({
            where: { userId: team.productOwnerUserId },
            select: { username: true },
          });
          productOwnerUsername = productOwner?.username;
        }

        if (team.projectManagerUserId) {
          const projectManager = await prisma.user.findUnique({
            where: { userId: team.projectManagerUserId },
            select: { username: true },
          });
          projectManagerUsername = projectManager?.username;
        }

        return {
          ...team,
          productOwnerUsername,
          projectManagerUsername,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
  try {
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : null,
        projectManagerUserId: projectManagerUserId ? Number(projectManagerUserId) : null,
      },
    });
    res.status(201).json(newTeam);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};
