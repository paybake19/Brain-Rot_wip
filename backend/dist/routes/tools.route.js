"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registry_1 = require("../tools/registry");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    res.json({ tools: registry_1.toolRegistry });
});
exports.default = router;
