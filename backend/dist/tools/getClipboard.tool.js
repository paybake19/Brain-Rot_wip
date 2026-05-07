"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClipboardTool = getClipboardTool;
const desktop_service_1 = require("../services/desktop.service");
async function getClipboardTool() {
    try {
        return await desktop_service_1.desktopService.getClipboard();
    }
    catch {
        return "Error: could not read clipboard.";
    }
}
