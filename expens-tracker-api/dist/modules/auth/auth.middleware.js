import jwt from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.js";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer")) {
        return res
            .status(401)
            .json({ error: "Token de autenticação não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decode = jwt.verify(token, jwtConfig.secret);
        req.userId = decode.sub;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
}
