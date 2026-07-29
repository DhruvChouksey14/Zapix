import {prisma} from "@repo/db";
import { Request, Response } from "express";

export const fetchAvailableTriggers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const availableTriggers = await prisma.availableTriggers.findMany();

  res.status(200).json({
    message: "Fetched available triggers",
    availableTriggers,
  });
};