"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const desktop_service_1 = require("../services/desktop.service");
const runShell_tool_1 = require("../tools/runShell.tool");
const validate_1 = require("../utils/validate");
const router = (0, express_1.Router)();
router.post("/shell", async (req, res) => {
    const parsed = validate_1.ShellSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid command" });
        return;
    }
    try {
        const output = await (0, runShell_tool_1.runShellTool)({ command: parsed.data.command });
        res.json({ output });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/clipboard", async (_req, res) => {
    try {
        const content = await desktop_service_1.desktopService.getClipboard();
        res.json({ content });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/clipboard", async (req, res) => {
    const parsed = validate_1.ClipboardWriteSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid text" });
        return;
    }
    try {
        await desktop_service_1.desktopService.setClipboard(parsed.data.text);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
