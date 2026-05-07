"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyBriefingJob = exports.DailyBriefingJob = void 0;
const obsidian_service_1 = require("../../services/obsidian.service");
const ollama_service_1 = require("../../services/ollama.service");
const bus_1 = require("../../events/bus");
const logger_service_1 = require("../../services/logger.service");
class DailyBriefingJob {
    async run() {
        logger_service_1.logger.info("DailyBriefingJob starting");
        try {
            let focus = "";
            let tasks = "";
            try {
                const f = await obsidian_service_1.obsidianService.readNote("00-Core/current-focus.md");
                focus = f.content;
            }
            catch {
                focus = "No current focus note found.";
            }
            try {
                const t = await obsidian_service_1.obsidianService.readNote("01-Active/tasks.md");
                tasks = t.content;
            }
            catch {
                tasks = "No active tasks note found.";
            }
            const prompt = `You are Brainrot. Generate a concise morning briefing (3 short paragraphs).
Current Focus: ${focus.slice(0, 500)}
Active Tasks: ${tasks.slice(0, 500)}
Today is ${new Date().toLocaleDateString()}.
Be direct, structured, and actionable.`;
            const briefing = await ollama_service_1.ollamaService.generate(prompt);
            bus_1.bus.emit("tts:speak", { text: briefing });
            logger_service_1.logger.info("DailyBriefingJob complete");
        }
        catch (err) {
            logger_service_1.logger.error("DailyBriefingJob failed", { error: err.message });
        }
    }
}
exports.DailyBriefingJob = DailyBriefingJob;
exports.dailyBriefingJob = new DailyBriefingJob();
