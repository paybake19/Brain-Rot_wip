"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenshotTool = screenshotTool;
const screen_1 = require("../vision/screen");
const describe_1 = require("../vision/describe");
async function screenshotTool() {
    try {
        const buffer = await (0, screen_1.captureScreen)();
        const description = await (0, describe_1.describeImage)(buffer);
        return description;
    }
    catch {
        return "Error: could not capture or describe the screen.";
    }
}
