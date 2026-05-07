"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaService = exports.OllamaService = void 0;
const config_1 = require("../config");
const logger_service_1 = require("./logger.service");
class OllamaService {
    constructor() {
        this.baseUrl = config_1.config.ollama.baseUrl;
        this.model = config_1.config.ollama.model;
    }
    async *streamChat(messages) {
        try {
            const res = await fetch(`${this.baseUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    stream: true,
                }),
            });
            if (!res.ok || !res.body) {
                yield { type: "error", content: `Ollama error: ${res.status}` };
                return;
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";
                for (const line of lines) {
                    if (!line.trim())
                        continue;
                    try {
                        const json = JSON.parse(line);
                        const token = json?.message?.content ?? "";
                        if (token)
                            yield { type: "token", content: token };
                        if (json?.done)
                            yield { type: "done", content: "" };
                    }
                    catch {
                        // malformed line — skip
                    }
                }
            }
            yield { type: "done", content: "" };
        }
        catch (err) {
            logger_service_1.logger.error("OllamaService.streamChat error", { error: err.message });
            yield { type: "error", content: err.message };
        }
    }
    async generate(prompt, imageBase64) {
        const body = {
            model: this.model,
            prompt,
            stream: false,
        };
        if (imageBase64)
            body.images = [imageBase64];
        const res = await fetch(`${this.baseUrl}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return data?.response ?? "";
    }
    async embed(text) {
        const res = await fetch(`${this.baseUrl}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: config_1.config.ollama.embedModel,
                prompt: text,
            }),
        });
        const data = await res.json();
        return data?.embedding ?? [];
    }
}
exports.OllamaService = OllamaService;
exports.ollamaService = new OllamaService();
