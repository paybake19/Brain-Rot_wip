"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowser = getBrowser;
exports.getPage = getPage;
exports.closeBrowser = closeBrowser;
exports.navigate = navigate;
exports.clickElement = clickElement;
exports.fillInput = fillInput;
const playwright_1 = require("playwright");
// Singleton browser instance
let browserInstance = null;
let pageInstance = null;
async function getBrowser() {
    if (!browserInstance || !browserInstance.isConnected()) {
        browserInstance = await playwright_1.chromium.launch({
            headless: true,
        });
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
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
        pageInstance = null;
    }
}
// Core Playwright interaction primitives
async function navigate(url) {
    const page = await getPage();
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });
}
async function clickElement(selector) {
    const page = await getPage();
    await page.click(selector);
}
async function fillInput(selector, value) {
    const page = await getPage();
    await page.fill(selector, value);
}
