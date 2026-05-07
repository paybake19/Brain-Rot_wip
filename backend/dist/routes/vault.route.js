"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const obsidian_service_1 = require("../services/obsidian.service");
const validate_1 = require("../utils/validate");
const router = (0, express_1.Router)();
router.get("/note", async (req, res) => {
    const parsed = validate_1.VaultReadSchema.safeParse({ path: req.query.path });
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
        return;
    }
    try {
        const note = await obsidian_service_1.obsidianService.readNote(parsed.data.path);
        res.json(note);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/list", async (req, res) => {
    const folder = req.query.folder || "";
    try {
        const files = await obsidian_service_1.obsidianService.listNotes(folder);
        res.json({ files });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        res.status(400).json({ error: "Missing query parameter 'q'" });
        return;
    }
    try {
        const results = await obsidian_service_1.obsidianService.searchVault(query);
        res.json({ results });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
