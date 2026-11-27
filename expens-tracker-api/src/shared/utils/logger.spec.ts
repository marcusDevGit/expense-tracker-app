import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "./logger.js";

describe("logger", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  it("deve emitir log estruturado em JSON para info", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    logger.info("Server started", { port: 3333 });

    expect(spy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({
      level: "info",
      message: "Server started",
      port: 3333,
    });
    expect(parsed.timestamp).toBeDefined();
  });

  it("deve emitir log estruturado em console.error para error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.error("Unhandled error", { code: "P1001" });

    expect(spy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({
      level: "error",
      message: "Unhandled error",
      code: "P1001",
    });
  });

  it("deve suprimir logs debug em produção", () => {
    process.env.NODE_ENV = "production";
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    logger.debug("Sensitive debug info", { token: "secret" });

    expect(spy).not.toHaveBeenCalled();
  });
});
