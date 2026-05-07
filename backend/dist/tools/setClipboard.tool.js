"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setClipboardTool = setClipboardTool;
const desktop_service_1 = require("../services/desktop.service");
async function setClipboardTool(args) {
    try {
        await desktop_service_1.desktopService.setClipboard(args.text);
        return "Clipboard updated successfully.";
    }
    catch {
        return "Error: could not write to clipboard.";
    }
}
