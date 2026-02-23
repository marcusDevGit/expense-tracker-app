import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }

    console.error("🚨 Internal Error:", err.stack);
    return res.status(500).json({
        success: false,
        error: "Internal server error",
    });
}