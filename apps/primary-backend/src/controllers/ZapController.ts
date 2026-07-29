import { prisma } from "@repo/db";
import { CreateZapSchema } from "@repo/types";
import { Request, Response } from "express";
import { formatZodError } from "../helper.js";

// Neon's free-tier compute auto-suspends when idle, so the first query after
// a period of inactivity can take a few seconds to "wake up" the database.
// Prisma's default transaction timeouts (maxWait: 2s, timeout: 5s) are too
// tight for that cold start, which is what was throwing P2028. Bumping these
// gives Neon room to wake up before Prisma gives up on acquiring a connection.
const TRANSACTION_OPTIONS = { maxWait: 10000, timeout: 15000 };

export const createZap = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const validation = CreateZapSchema.safeParse(body);

    // @ts-ignore
    const id = req.id;
    console.log(id);
    console.log(req.body);

    if (validation.error) {
      res.status(411).json({
        message: "Incorrect inputs",
        error: formatZodError(validation.error),
      });
      return;
    }

    const zapId = await prisma.$transaction(async (tx) => {
      const zap = await tx.zap.create({
        data: {
          userId: parseInt(id),
          triggerId: "",
          actions: {
            create: validation.data.actions.map((action, index) => ({
              actionId: action.availableActionId,
              metadata: action.actionMetaData,
              sortingOrder: index + 1,
            })),
          },
        },
      });

      const trigger = await tx.trigger.create({
        data: {
          triggerId: validation.data.availableTriggerId,
          zapId: zap.id,
        },
      });

      await tx.zap.update({
        where: { id: zap.id },
        data: {
          triggerId: trigger.id,
        },
      });

      return zap.id;
    }, TRANSACTION_OPTIONS);

    res.status(201).json({
      message: "Zap created successfully",
      zapId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create zap",
      error,
    });
  }
};

export const fetchZapList = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const id = req.id;

    const zaps = await prisma.zap.findMany({
      where: {
        userId: id,
      },
      include: {
        actions: {
          include: {
            action: true,
          },
        },
        trigger: {
          include: {
            trigger: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Zaps fetched successfully",
      data: {
        zaps,
        total: zaps.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch zaps",
      error,
    });
  }
};

export const fetchZapWithId = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const id = req.id;

    const zap = await prisma.zap.findUnique({
      where: {
        // @ts-ignore
        id: req.params.zapId,
        userId: id,
      },
      include: {
        actions: {
          include: {
            action: true,
          },
        },
        trigger: {
          include: {
            trigger: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Zap fetched successfully",
      zap,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch zap",
      error,
    });
  }
};

export const updateZapWithId = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const id = req.id;

    const { actions } = req.body;

    await prisma.$transaction(async (tx) => {
      await tx.action.deleteMany({
        where: {
          // @ts-ignore
          zapId: req.params.zapId,
        },
      });

      await tx.zap.update({
        where: {
          // @ts-ignore
          id: req.params.zapId,
          userId: id,
        },
        data: {
          actions: {
            create: actions.map((action: any, index: number) => ({
              actionId: action.availableActionId,
              metadata: action.actionMetaData,
              sortingOrder: index + 1,
            })),
          },
        },
      });
    }, TRANSACTION_OPTIONS);

    res.status(200).json({
      message: "Zap updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update zap",
      error,
    });
  }
};

export const deleteZapWithId = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const id = req.id;

    const deletedZap = await prisma.$transaction(async (tx) => {
      await tx.trigger.delete({
        where: {
          // @ts-ignore
          zapId: req.params.zapId,
        },
      });

      await tx.action.deleteMany({
        where: {
          // @ts-ignore
          zapId: req.params.zapId,
        },
      });

      return tx.zap.delete({
        where: {
          // @ts-ignore
          id: req.params.zapId,
          userId: id,
        },
      });
    }, TRANSACTION_OPTIONS);

    res.status(200).json({
      message: "Zap deleted successfully",
      deletedZap,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete zap",
      error,
    });
  }
};

export const renameZapWithId = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const id = req.id;

    const { name } = req.body;

    const zap = await prisma.zap.update({
      where: {
        // @ts-ignore
        id: req.params.zapId,
        userId: id,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      message: "Zap renamed successfully",
      zap,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not rename zap",
      error,
    });
  }
};

export const enableZapExecution = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const id = req.id;

    const { isActive } = req.body;

    const zap = await prisma.zap.update({
      where: {
        // @ts-ignore
        id: req.params.zapId,
        userId: id,
      },
      data: {
        isActive,
      },
    });

    res.status(200).json({
      message: "Zap updated successfully",
      zap,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update zap",
      error,
    });
  }
};