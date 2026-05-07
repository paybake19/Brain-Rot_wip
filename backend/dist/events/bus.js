"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bus = void 0;
const mitt_1 = __importDefault(require("mitt"));
exports.bus = (0, mitt_1.default)();
exports.bus.on("vault:changed", async ({ path }) => {
    exports.bus.on("tts:speak", ({ text }) => {
        exports.bus.on("stt:result", ({ transcript, sessionId }) => {
        });
    });
});
