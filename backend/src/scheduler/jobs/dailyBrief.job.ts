import { obsidianService } from "../../services/obsidian.service";
import { ollamaService } from "../../services/ollama.service";
import { bus } from "../../events/bus";
import { logger } from "../../services/logger.service";

export class DailyBriefingJob {
  async run(): Promise<void> {
    logger.info("DailyBriefingJob starting");
    try {
      let focus = "";
      let tasks = "";

      try {
        const f = await obsidianService.readNote("00-Core/current-focus.md");
        focus = f.content;
      } catch { focus = "No current focus note found."; }

      try {
        const t = await obsidianService.readNote("01-Active/tasks.md");
        tasks = t.content;
      } catch { tasks = "No active tasks note found."; }

      const prompt = `You are Brainrot. Generate a concise morning briefing (3 short paragraphs).
Current Focus: ${focus.slice(0, 500)}
Active Tasks: ${tasks.slice(0, 500)}
Today is ${new Date().toLocaleDateString()}.
Be direct, structured, and actionable.`;

      const briefing = await ollamaService.generate(prompt);
      bus.emit("tts:speak", { text: briefing });
      logger.info("DailyBriefingJob complete");
    } catch (err: any) {
      logger.error("DailyBriefingJob failed", { error: err.message });
    }
  }
}

export const dailyBriefingJob = new DailyBriefingJob();
