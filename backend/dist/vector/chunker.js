"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkMarkdown = chunkMarkdown;
const hash_1 = require("../utils/hash");
const TARGET_CHUNK_SIZE = 1600; // ~400 tokens
function chunkMarkdown(notePath, content) {
    const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
    const chunks = [];
    let current = "";
    let chunkIndex = 0;
    let prevParagraph = "";
    for (const para of paragraphs) {
        if ((current + para).length > TARGET_CHUNK_SIZE && current) {
            chunks.push({
                path: notePath,
                chunkIndex,
                content: current.trim(),
                hash: (0, hash_1.sha256)(current.trim()),
            });
            current = prevParagraph + "\n\n"; // 1-paragraph overlap
            chunkIndex++;
        }
        current += para + "\n\n";
        prevParagraph = para;
    }
    if (current.trim()) {
        chunks.push({
            path: notePath,
            chunkIndex,
            content: current.trim(),
            hash: (0, hash_1.sha256)(current.trim()),
        });
    }
    return chunks;
}
