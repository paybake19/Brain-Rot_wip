"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePath = sanitizePath;
exports.sanitizeShellArg = sanitizeShellArg;
const BLOCKED_PATH_PATTERNS = [
    "../",
    "..\\",
    "C:\\Windows",
    "/etc",
    "/root",
    "system32",
];
const SHELL_METACHARACTERS = /[;&|><`$(){}]/g;
function sanitizePath(input) {
    for (const pattern of BLOCKED_PATH_PATTERNS) {
        if (input.includes(pattern)) {
            throw new Error(`Blocked path pattern detected: ${pattern}`);
        }
    }
    const cleaned = input.replace(/^[./\\]+/, "").trim();
    if (!cleaned)
        throw new Error("Sanitized path is empty");
    return cleaned;
}
function sanitizeShellArg(input) {
    const cleaned = input.replace(SHELL_METACHARACTERS, "").trim();
    if (!cleaned)
        throw new Error("Sanitized shell arg is empty");
    return cleaned;
}
