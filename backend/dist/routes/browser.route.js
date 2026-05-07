"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const actions_1 = require("../browser/actions");
const scraper_1 = require("../browser/scraper");
const validate_1 = require("../utils/validate");
const router = (0, express_1.Router)();
router.post("/navigate", async (req, res) => {
    const parsed = validate_1.BrowserNavigateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid URL" });
        return;
    }
    try {
        await (0, actions_1.navigate)(parsed.data.url);
        res.json({ success: true, url: parsed.data.url });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/click", async (req, res) => {
    const parsed = validate_1.BrowserClickSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid selector" });
        return;
    }
    try {
        await (0, actions_1.clickElement)(parsed.data.selector);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/scrape", async (_req, res) => {
    try {
        const result = await (0, scraper_1.scrapePage)();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
