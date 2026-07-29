import {prisma} from "@repo/db";
import { Request, Response } from "express";

export const fetchAvailableActions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const availableActions = await prisma.availableActions.findMany();

  res.status(200).json({
    message: "Fetched available actions",
    availableActions,
  });
};