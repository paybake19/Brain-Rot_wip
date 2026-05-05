import { ollamaService } from "../services/ollama.service";
import { navigate, clickElement, fillInput } from "../browser/actions";
import { scrapePage } from "../browser/scraper";
import { logger } from "../services/logger.service";

const MAX_STEPS = 10;

interface BrowserAction {
  action: "navigate" | "click" | "fill" | "scrape" | "done";
  url?: string;
  selector?: string;
  value?: string;
  reason?: string;
}

export class BrowserAgent {
  async run(instruction: string): Promise<string> {
    logger.info("BrowserAgent started", { instruction });

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

      const raw = await ollamaService.generate(prompt);

      let action: BrowserAction;
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        action = JSON.parse(clean);
      } catch {
        logger.warn("BrowserAgent failed to parse action JSON", { raw });
        break;
      }

      logger.info("BrowserAgent step", { step: stepCount, action: action.action, reason: action.reason });

      switch (action.action) {
        case "navigate": {
          if (!action.url) break;
          await navigate(action.url);
          const { text } = await scrapePage();
          pageContext = text;
          break;
        }

        case "click": {
          if (!action.selector) break;
          await clickElement(action.selector);
          const { text } = await scrapePage();
          pageContext = text;
          break;
        }

        case "fill": {
          if (!action.selector || !action.value) break;
          await fillInput(action.selector, action.value);
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
          logger.info("BrowserAgent done", { steps: stepCount });
          return finalResult;
        }
      }
    }

    logger.warn("BrowserAgent hit max steps", { MAX_STEPS });
    return finalResult || pageContext.slice(0, 3000);
  }
}

export const browserAgent = new BrowserAgent();
