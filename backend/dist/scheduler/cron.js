"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const dailyBrief_job_1 = require("./jobs/dailyBrief.job");
const vaultReindex_job_1 = require("./jobs/vaultReindex.job");
const reminderCheck_job_1 = require("./jobs/reminderCheck.job");
const logger_service_1 = require("../services/logger.service");
function startScheduler() {
    // Daily briefing at 8:00 AM
    node_cron_1.default.schedule("0 8 * * *", () => {
        logger_service_1.logger.info("Cron: daily briefing");
        dailyBrief_job_1.dailyBriefingJob.run();
    });
    // Nightly vault reindex at 2:00 AM
    node_cron_1.default.schedule("0 2 * * *", () => {
        logger_service_1.logger.info("Cron: vault reindex");
        vaultReindex_job_1.vaultReindexJob.run();
    });
    // Reminder check every 15 minutes
    node_cron_1.default.schedule("*/15 * * * *", () => {
        reminderCheck_job_1.reminderCheckJob.run();
    });
    logger_service_1.logger.info("Scheduler started");
}
