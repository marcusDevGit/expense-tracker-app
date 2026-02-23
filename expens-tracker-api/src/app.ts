import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import "dotenv/config";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./config/swagger.js";

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? frontendUrl : true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", router);
app.use(errorHandler);


export default app;
