import { Request, Response } from "express";
import { SignupSchema, SigninSchema } from "@repo/types";
import {prisma} from "@repo/db";
import { formatZodError } from "../helper.js";
import { sendWelcomeEmail } from "@repo/email";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validation = SignupSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(422).json({
      message: "Validation failed",
      error: formatZodError(validation.error),
    });
  }

  const { name, email, password } = validation.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
      error: {
        email: "User with this email already exists",
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Send welcome email
  await sendWelcomeEmail(user.email, user.name);

  const { password: _, ...safeUser } = user;

  return res.status(201).json({
    message: "Signup successful",
    data: safeUser,
  });
};

export const signin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validation = SigninSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(422).json({
      message: "Validation failed",
      error: formatZodError(validation.error),
    });
  }

  const { email, password } = validation.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return res.status(200).json({
    message: "Signin successful",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    },
  });
};

export const getUserDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = Number(req.params.userId);

  if (Number.isNaN(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    message: "User fetched successfully",
    data: user,
  });
};