import cron from "node-cron";
import { dailyBriefingJob } from "./jobs/dailyBriefing.job";
import { vaultReindexJob } from "./jobs/vaultReindex.job";
import { reminderCheckJob } from "./jobs/reminderCheck.job";
import { logger } from "../services/logger.service";

export function startScheduler(): void {
  // Daily briefing at 8:00 AM
  cron.schedule("0 8 * * *", () => {
    logger.info("Cron: daily briefing");
    dailyBriefingJob.run();
  });

  // Nightly vault reindex at 2:00 AM
  cron.schedule("0 2 * * *", () => {
    logger.info("Cron: vault reindex");
    vaultReindexJob.run();
  });

  // Reminder check every 15 minutes
  cron.schedule("*/15 * * * *", () => {
    reminderCheckJob.run();
  });

  logger.info("Scheduler started");
}
