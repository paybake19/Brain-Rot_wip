import { obsidianService } from "../../services/obsidian.service";
import { bus } from "../../events/bus";
import { logger } from "../../services/logger.service";

const TODAY = new Date().toISOString().split("T")[0];
const TASK_REGEX = /- \[ \] (.+?)(?:due:\s*(\d{4}-\d{2}-\d{2}))?$/gm;

export class ReminderCheckJob {
  async run(): Promise<void> {
    const files = await obsidianService.listNotes("01-Active/");

    for (const filePath of files) {
      try {
        const note = await obsidianService.readNote(filePath);
        let match;
        while ((match = TASK_REGEX.exec(note.content)) !== null) {
          const [, title, due] = match;
          if (!due || due <= TODAY) {
            bus.emit("tts:speak", { text: `Reminder: ${title.trim()}` });
          }
        }
      } catch (err: any) {
        logger.error("ReminderCheck failed for file", { filePath, error: err.message });
      }
    }
  }
}

export const reminderCheckJob = new ReminderCheckJob();
