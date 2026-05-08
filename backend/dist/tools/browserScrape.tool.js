"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserScrapeTool = browserScrapeTool;
const scraper_1 = require("../browser/scraper");
const logger_service_1 = require("../services/logger.service");
async function browserScrapeTool() {
    try {
        const { text, links } = await (0, scraper_1.scrapePage)();
        return `[Page Text]\n${text}\n\n[Links]\n${links.slice(0, 20).join("\n")}`;
    }
    catch (err) {
        logger_service_1.logger.error("browserScrapeTool failed", { error: err.message });
        return "Error: failed to scrape current page.";
    }
}
