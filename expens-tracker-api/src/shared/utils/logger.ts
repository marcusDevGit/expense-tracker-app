type LogLevel = "debug" | "info" | "warn" | "error";

export type LogMeta = Record<string, unknown>;

interface LogEntry extends LogMeta {
  timestamp: string;
  level: LogLevel;
  message: string;
}

function writeLog(level: LogLevel, message: string, meta?: LogMeta): void {
  if (level === "debug" && process.env.NODE_ENV === "production") {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const serialized = JSON.stringify(entry);
  if (level === "error") {
    console.error(serialized);
  } else if (level === "warn") {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
}

export const logger = {
  debug(message: string, meta?: LogMeta) {
    writeLog("debug", message, meta);
  },
  info(message: string, meta?: LogMeta) {
    writeLog("info", message, meta);
  },
  warn(message: string, meta?: LogMeta) {
    writeLog("warn", message, meta);
  },
  error(message: string, meta?: LogMeta) {
    writeLog("error", message, meta);
  },
};
