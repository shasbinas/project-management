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
            select: { username: true, email: true },
          });
          if (productOwner) {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productOwner.username);
            productOwnerUsername = isUUID ? productOwner.email.split("@")[0] : productOwner.username;
          }
        }

        if (team.projectManagerUserId) {
          const projectManager = await prisma.user.findUnique({
            where: { userId: team.projectManagerUserId },
            select: { username: true, email: true },
          });
          if (projectManager) {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectManager.username);
            projectManagerUsername = isUUID ? projectManager.email.split("@")[0] : projectManager.username;
          }
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
