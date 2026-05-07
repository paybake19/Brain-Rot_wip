"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.desktopService = exports.DesktopService = void 0;
const clipboardy_1 = __importDefault(require("clipboardy"));
class DesktopService {
    async getClipboard() {
        return clipboardy_1.default.read();
    }
    async setClipboard(text) {
        await clipboardy_1.default.write(text);
    }
}
exports.DesktopService = DesktopService;
exports.desktopService = new DesktopService();
