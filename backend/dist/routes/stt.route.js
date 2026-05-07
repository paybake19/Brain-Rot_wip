"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stt_service_1 = require("../services/stt.service");
const validate_1 = require("../utils/validate");
const bus_1 = require("../events/bus");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const parsed = validate_1.STTSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
        return;
    }
    try {
        const transcript = await stt_service_1.sttService.transcribe(parsed.data.audioBase64, parsed.data.language);
        bus_1.bus.emit("stt:result", { transcript, sessionId: parsed.data.sessionId });
        res.json({ transcript });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
