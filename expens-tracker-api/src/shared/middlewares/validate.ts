import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

type RequestPart = "body" | "query" | "params";

/**
 * Validates a part of the incoming Express request against a Zod schema
 * and replaces it with the parsed output.
 */
export function validate(schema: ZodType, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const message = result.error.issues[0]?.message || "Dados inválidos";
      throw new AppError(message, 400);
    }

    if (part === "body") {
      req.body = result.data;
    }
    next();
  };
}
