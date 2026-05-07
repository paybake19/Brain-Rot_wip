"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildToolPrompt = buildToolPrompt;
const registry_1 = require("../../tools/registry");
function buildToolPrompt() {
    const schemas = registry_1.toolRegistry.map((t) => JSON.stringify(t, null, 2));
    return `<tools>\n${schemas.join("\n")}\n</tools>

When you need to use a tool, respond with a JSON block wrapped in <tool_call></tool_call> tags.
Example:
<tool_call>
{"name": "read_note", "arguments": {"path": "00-Core/AI-Memory.md"}}
</tool_call>
Only call one tool at a time. Wait for the result before calling another.`;
}
