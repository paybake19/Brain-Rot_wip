import { ollamaService } from "../services/ollama.service";
import { logger } from "../services/logger.service";

// Stubbed until Gmail OAuth is configured
// Wire emailService.sendEmail() and emailService.getInbox() here

interface ParsedEmailIntent {
  action: "read" | "compose" | "reply" | "unknown";
  to: string | null;
  subject: string | null;
  bodyIntent: string | null;
}

export class EmailAgent {
  async run(instruction: string): Promise<string> {
    logger.info("EmailAgent started", { instruction });

    const parsePrompt = `You are an email assistant.
Classify this instruction: "${instruction}"
Respond with a single JSON object — no markdown, no explanation:
{
  "action": "read" | "compose" | "reply" | "unknown",
  "to": "<recipient email or null>",
  "subject": "<email subject or null>",
  "bodyIntent": "<one sentence describing what the email should say, or null>"
}`;

    const raw = await ollamaService.generate(parsePrompt);

    let intent: ParsedEmailIntent;
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      intent = JSON.parse(clean);
    } catch {
      logger.error("EmailAgent failed to parse intent", { raw });
      return `Error: could not parse email intent from "${instruction}"`;
    }

    logger.info("EmailAgent parsed intent", { intent });

    return `Email not yet configured. Parsed intent:
- Action: ${intent.action}
- To: ${intent.to ?? "N/A"}
- Subject: ${intent.subject ?? "N/A"}
- Body intent: ${intent.bodyIntent ?? "N/A"}

Connect Gmail OAuth to enable email sending.`;
  }
}

export const emailAgent = new EmailAgent();
