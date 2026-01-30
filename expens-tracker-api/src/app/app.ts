import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "../routes/index.js";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
