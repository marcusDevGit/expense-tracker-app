import app from "./app.js";
import { logger } from "./shared/utils/logger.js";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  logger.info("Server started", { port: Number(PORT) });
});
