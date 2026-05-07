"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const screen_1 = require("../vision/screen");
const describe_1 = require("../vision/describe");
const router = (0, express_1.Router)();
router.get("/screenshot", async (_req, res) => {
    try {
        const buffer = await (0, screen_1.captureScreen)();
        const description = await (0, describe_1.describeImage)(buffer);
        res.json({ description });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/describe", async (req, res) => {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
        res.status(400).json({ error: "Missing imageBase64" });
        return;
    }
    try {
        const buffer = Buffer.from(imageBase64, "base64");
        const description = await (0, describe_1.describeImage)(buffer);
        res.json({ description });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
