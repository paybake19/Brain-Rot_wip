"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigate = navigate;
exports.clickElement = clickElement;
exports.fillInput = fillInput;
const browser_1 = require("./browser");
async function navigate(url) {
    const page = await (0, browser_1.getPage)();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
}
async function clickElement(selector) {
    const page = await (0, browser_1.getPage)();
    await page.click(selector, { timeout: 10000 });
}
async function fillInput(selector, value) {
    const page = await (0, browser_1.getPage)();
    await page.fill(selector, value);
}
