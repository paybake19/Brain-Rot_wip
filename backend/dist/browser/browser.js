"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowser = getBrowser;
exports.getPage = getPage;
exports.closeBrowser = closeBrowser;
const playwright_1 = require("playwright");
let browserInstance = null;
let pageInstance = null;
async function getBrowser() {
    if (!browserInstance || !browserInstance.isConnected()) {
        browserInstance = await playwright_1.chromium.launch({ headless: true });
    }
    return browserInstance;
}
async function getPage() {
    if (!pageInstance || pageInstance.isClosed()) {
        const browser = await getBrowser();
        pageInstance = await browser.newPage();
    }
    return pageInstance;
}
async function closeBrowser() {
    await browserInstance?.close();
    browserInstance = null;
    pageInstance = null;
}
