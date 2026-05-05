import { execa } from "execa";
import { isCommandAllowed } from "../middleware/allowlist.middleware";
import { logger } from "../services/logger.service";

export async function runShellTool(args: { command: string }): Promise<string> {
  if (!isCommandAllowed(args.command)) {
    return `Error: command "${args.command}" is not on the allowlist.`;
  }
  try {
    const [bin, ...rest] = args.command.split(/\s+/);
    const result = await execa(bin, rest);
    return result.stdout || "(no output)";
  } catch (err: any) {
    logger.error("runShellTool error", { command: args.command, error: err.message });
    return `Error: ${err.message}`;
  }
}
