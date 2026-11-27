import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }

    const prismaCode =
        "code" in err && typeof err.code === "string"
            ? err.code
            : undefined;

    logger.error("Unhandled internal error", {
        requestId: req.requestId ?? null,
        method: req.method,
        path: req.originalUrl,
        name: err.name,
        message: err.message,
        code: prismaCode,
        stack: err.stack,
    });

    return res.status(500).json({
        success: false,
        error: "Internal server error",
    });
}