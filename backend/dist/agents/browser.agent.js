"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserAgent = exports.BrowserAgent = void 0;
const ollama_service_1 = require("../services/ollama.service");
const actions_1 = require("../browser/actions");
//import { scrapePage } from "../browser/scraper";
const logger_service_1 = require("../services/logger.service");
const MAX_STEPS = 10;
class BrowserAgent {
    async run(instruction) {
        logger_service_1.logger.info("BrowserAgent started", { instruction });
        let stepCount = 0;
        let pageContext = "No page loaded yet.";
        let finalResult = "";
        while (stepCount < MAX_STEPS) {
            stepCount++;
            const prompt = `You are a browser automation agent.
Instruction: "${instruction}"
Current page state: ${pageContext.slice(0, 1000)}
Step: ${stepCount}/${MAX_STEPS}

Decide the next action. Respond with a single JSON object — no markdown, no explanation:
{
  "action": "navigate" | "click" | "fill" | "scrape" | "done",
  "url": "<full URL if navigate, else null>",
  "selector": "<CSS selector if click or fill, else null>",
  "value": "<text to fill if fill, else null>",
  "reason": "<one sentence why>"
}
If the task is complete or you have enough information, use action "done".`;
            const raw = await ollama_service_1.ollamaService.generate(prompt);
            let action;
            try {
                const clean = raw.replace(/```json|```/g, "").trim();
                action = JSON.parse(clean);
            }
            catch {
                logger_service_1.logger.warn("BrowserAgent failed to parse action JSON", { raw });
                break;
            }
            logger_service_1.logger.info("BrowserAgent step", { step: stepCount, action: action.action, reason: action.reason });
            switch (action.action) {
                case "navigate": {
                    if (!action.url)
                        break;
                    await (0, actions_1.navigate)(action.url);
                    const { text } = await scrapePage();
                    pageContext = text;
                    break;
                }
                case "click": {
                    if (!action.selector)
                        break;
                    await (0, actions_1.clickElement)(action.selector);
                    const { text } = await scrapePage();
                    pageContext = text;
                    break;
                }
                case "fill": {
                    if (!action.selector || !action.value)
                        break;
                    await (0, actions_1.fillInput)(action.selector, action.value);
                    break;
                }
                case "scrape": {
                    const { text, links } = await scrapePage();
                    pageContext = text;
                    finalResult = `${text.slice(0, 3000)}\n\nLinks:\n${links.slice(0, 10).join("\n")}`;
                    break;
                }
                case "done": {
                    finalResult = finalResult || pageContext.slice(0, 3000);
                    logger_service_1.logger.info("BrowserAgent done", { steps: stepCount });
                    return finalResult;
                }
            }
        }
        logger_service_1.logger.warn("BrowserAgent hit max steps", { MAX_STEPS });
        return finalResult || pageContext.slice(0, 3000);
    }
}
exports.BrowserAgent = BrowserAgent;
exports.browserAgent = new BrowserAgent();
