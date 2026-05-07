"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSSEHeaders = setSSEHeaders;
exports.writeSSEChunk = writeSSEChunk;
exports.pipeStreamToSSE = pipeStreamToSSE;
function setSSEHeaders(res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
}
function writeSSEChunk(res, chunk) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
}
async function pipeStreamToSSE(stream, res, onToolCall) {
    setSSEHeaders(res);
    for await (const chunk of stream) {
        if (chunk.type === "token") {
            writeSSEChunk(res, chunk);
        }
        else if (chunk.type === "tool_call" && onToolCall) {
            const result = await onToolCall(chunk.content);
            writeSSEChunk(res, { type: "tool_call", content: result });
        }
        else if (chunk.type === "done") {
            writeSSEChunk(res, { type: "done", content: "" });
            res.end();
            return;
        }
        else if (chunk.type === "error") {
            writeSSEChunk(res, chunk);
            res.end();
            return;
        }
    }
    res.end();
}
