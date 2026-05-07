"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderCheckJob = exports.ReminderCheckJob = void 0;
const obsidian_service_1 = require("../../services/obsidian.service");
const bus_1 = require("../../events/bus");
const logger_service_1 = require("../../services/logger.service");
const TODAY = new Date().toISOString().split("T")[0];
const TASK_REGEX = /- \[ \] (.+?)(?:due:\s*(\d{4}-\d{2}-\d{2}))?$/gm;
class ReminderCheckJob {
    async run() {
        const files = await obsidian_service_1.obsidianService.listNotes("01-Active/");
        for (const filePath of files) {
            try {
                const note = await obsidian_service_1.obsidianService.readNote(filePath);
                let match;
                while ((match = TASK_REGEX.exec(note.content)) !== null) {
                    const [, title, due] = match;
                    if (!due || due <= TODAY) {
                        bus_1.bus.emit("tts:speak", { text: `Reminder: ${title.trim()}` });
                    }
                }
            }
            catch (err) {
                logger_service_1.logger.error("ReminderCheck failed for file", { filePath, error: err.message });
            }
        }
    }
}
exports.ReminderCheckJob = ReminderCheckJob;
exports.reminderCheckJob = new ReminderCheckJob();
