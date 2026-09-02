import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
} from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new ApiError(
      400,
      "Name, email and password are required"
    );
  }

  const result = await registerUser(
    name,
    email,
    password
  );

  res.status(201).json({
    success: true,
    ...result,
  });
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  const result = await loginUser(email, password);

  res.status(200).json({
    success: true,
    ...result,
  });
};