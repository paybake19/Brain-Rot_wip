"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAgent = exports.EmailAgent = void 0;
const ollama_service_1 = require("../services/ollama.service");
const logger_service_1 = require("../services/logger.service");
class EmailAgent {
    async run(instruction) {
        logger_service_1.logger.info("EmailAgent started", { instruction });
        const parsePrompt = `You are an email assistant.
Classify this instruction: "${instruction}"
Respond with a single JSON object — no markdown, no explanation:
{
  "action": "read" | "compose" | "reply" | "unknown",
  "to": "<recipient email or null>",
  "subject": "<email subject or null>",
  "bodyIntent": "<one sentence describing what the email should say, or null>"
}`;
        const raw = await ollama_service_1.ollamaService.generate(parsePrompt);
        let intent;
        try {
            const clean = raw.replace(/```json|```/g, "").trim();
            intent = JSON.parse(clean);
        }
        catch {
            logger_service_1.logger.error("EmailAgent failed to parse intent", { raw });
            return `Error: could not parse email intent from "${instruction}"`;
        }
        logger_service_1.logger.info("EmailAgent parsed intent", { intent });
        return `Email not yet configured. Parsed intent:
- Action: ${intent.action}
- To: ${intent.to ?? "N/A"}
- Subject: ${intent.subject ?? "N/A"}
- Body intent: ${intent.bodyIntent ?? "N/A"}

Connect Gmail OAuth to enable email sending.`;
    }
}
exports.EmailAgent = EmailAgent;
exports.emailAgent = new EmailAgent();
