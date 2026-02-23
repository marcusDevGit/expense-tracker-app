import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "../routes/index.js";
import "dotenv/config";
import { errorHandler } from "../shared/middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);
app.use(errorHandler);


export default app;
