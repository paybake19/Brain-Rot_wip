"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserClickSchema = exports.BrowserNavigateSchema = exports.ClipboardWriteSchema = exports.ShellSchema = exports.STTSchema = exports.VaultReadSchema = exports.ChatRequestSchema = void 0;
const zod_1 = require("zod");
exports.ChatRequestSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
    messages: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        role: zod_1.z.enum(["user", "assistant", "system", "tool"]),
        content: zod_1.z.string(),
        timestamp: zod_1.z.number(),
    })),
    imageBase64: zod_1.z.string().optional(),
});
exports.VaultReadSchema = zod_1.z.object({
    path: zod_1.z.string().min(1),
});
exports.STTSchema = zod_1.z.object({
    audioBase64: zod_1.z.string(),
    language: zod_1.z.string().default("en"),
    sessionId: zod_1.z.string().uuid(),
});
exports.ShellSchema = zod_1.z.object({
    command: zod_1.z.string().min(1),
});
exports.ClipboardWriteSchema = zod_1.z.object({
    text: zod_1.z.string().min(1),
});
exports.BrowserNavigateSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
});
exports.BrowserClickSchema = zod_1.z.object({
    selector: zod_1.z.string().min(1),
});
