"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Stubbed — wire to CalendarService when Google OAuth is ready
router.get("/events", (_req, res) => {
    res.json({ events: [], message: "Calendar not yet configured" });
});
router.post("/create", (_req, res) => {
    res.status(501).json({ message: "Calendar create not yet configured" });
});
exports.default = router;
