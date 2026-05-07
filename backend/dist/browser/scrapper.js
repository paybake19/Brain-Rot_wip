"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapePage = scrapePage;
// Canonical file — rename src/browser/scrapper.ts → src/browser/scraper.ts
// (removes double-p typo that breaks all 4 import sites)
const browser_1 = require("./browser");
async function scrapePage() {
    const page = await (0, browser_1.getPage)();
    const text = await page.evaluate(() => document.body?.innerText ?? "");
    const links = await page.evaluate(() => Array.from(document.querySelectorAll("a[href]"))
        .map((a) => a.href)
        .filter((h) => h.startsWith("http")));
    return {
        text: text.slice(0, 5000),
        links: links.slice(0, 50),
    };
}
