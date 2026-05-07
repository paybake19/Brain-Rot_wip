"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarAgent = exports.CalendarAgent = void 0;
const ollama_service_1 = require("../services/ollama.service");
const logger_service_1 = require("../services/logger.service");
class CalendarAgent {
    async run(instruction) {
        logger_service_1.logger.info("CalendarAgent started", { instruction });
        // 1. Extract event details from natural language
        const parsePrompt = `You are a calendar assistant.
Extract event details from this instruction: "${instruction}"
Today is ${new Date().toISOString()}.
Respond with a single JSON object — no markdown, no explanation:
{
  "title": "<event title>",
  "date": "<YYYY-MM-DD>",
  "time": "<HH:MM in 24h format>",
  "durationMinutes": <number>,
  "attendees": ["<email1>", "<email2>"]
}
If a field cannot be determined, use a sensible default. Duration default is 60 minutes.`;
        const raw = await ollama_service_1.ollamaService.generate(parsePrompt);
        let intent;
        try {
            const clean = raw.replace(/```json|```/g, "").trim();
            intent = JSON.parse(clean);
        }
        catch {
            logger_service_1.logger.error("CalendarAgent failed to parse intent", { raw });
            return `Error: could not parse event details from "${instruction}"`;
        }
        logger_service_1.logger.info("CalendarAgent parsed intent", { intent });
        // 2. Stub response until calendar service is wired
        return `Calendar not yet configured. Parsed intent:
- Title: ${intent.title}
- Date: ${intent.date}
- Time: ${intent.time}
- Duration: ${intent.durationMinutes} minutes
- Attendees: ${intent.attendees.join(", ") || "none"}

Connect Google OAuth to enable event creation.`;
    }
}
exports.CalendarAgent = CalendarAgent;
exports.calendarAgent = new CalendarAgent();
