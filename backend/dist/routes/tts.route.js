"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Stubbed — wire to Piper or equivalent TTS binary when ready
router.post("/speak", (_req, res) => {
    res.status(501).json({ message: "TTS not yet configured" });
});
exports.default = router;
