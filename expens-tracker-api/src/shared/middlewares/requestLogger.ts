import crypto from "node:crypto";
import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

/**
 * Attaches a unique requestId to each request and logs completion metrics.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime.bigint();
  const requestId =
    (req.headers["x-request-id"] as string | undefined) || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const durationMs =
      Number(process.hrtime.bigint() - startTime) / 1_000_000;
    const meta = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      userId: req.userId ?? null,
    };

    if (res.statusCode >= 500) {
      logger.error("HTTP request failed", meta);
    } else if (res.statusCode >= 400) {
      logger.warn("HTTP request warning", meta);
    } else {
      logger.info("HTTP request completed", meta);
    }
  });

  next();
}
