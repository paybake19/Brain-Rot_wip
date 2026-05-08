"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.desktopService = exports.DesktopService = void 0;
const clipboardy_1 = __importDefault(require("clipboardy"));
const node_notifier_1 = __importDefault(require("node-notifier"));
const logger_service_1 = require("./logger.service");
class DesktopService {
    async getClipboard() {
        return clipboardy_1.default.read();
    }
    async setClipboard(text) {
        await clipboardy_1.default.write(text);
    }
    notify(title, body) {
        node_notifier_1.default.notify({ title, message: body });
        logger_service_1.logger.info("Desktop notification sent", { title });
    }
}
exports.DesktopService = DesktopService;
exports.desktopService = new DesktopService();
