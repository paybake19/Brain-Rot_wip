"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const config_1 = require("../config");
function authMiddleware(req, res, next) {
    const key = req.headers["x-api-key"];
    if (!key || key !== config_1.config.apiKey) {
        res.status(401).json({ error: "Unauthorized", message: "Invalid or missing API key" });
        return;
    }
    next();
}
