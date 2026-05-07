"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runShellTool = runShellTool;
const execa_1 = __importDefault(require("execa"));
const allowlist_middleware_1 = require("../middleware/allowlist.middleware");
const logger_service_1 = require("../services/logger.service");
async function runShellTool(args) {
    if (!(0, allowlist_middleware_1.isCommandAllowed)(args.command)) {
        return `Error: command "${args.command}" is not on the allowlist.`;
    }
    try {
        const [bin, ...rest] = args.command.split(/\s+/);
        const result = await (0, execa_1.default)(bin, rest);
        return result.stdout || "(no output)";
    }
    catch (err) {
        logger_service_1.logger.error("runShellTool error", { command: args.command, error: err.message });
        return `Error: ${err.message}`;
    }
}
