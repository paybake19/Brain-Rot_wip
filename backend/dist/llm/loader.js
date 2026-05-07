"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadContext = loadContext;
const embedder_1 = require("../vector/embedder");
const search_1 = require("../vector/search");
const logger_service_1 = require("../services/logger.service");
async function loadContext(userQuery) {
    try {
        const queryVector = await (0, embedder_1.embed)(userQuery);
        const chunks = await (0, search_1.semanticSearch)(queryVector, 5);
        return chunks.map((c) => `### ${c.path}\n${c.content.slice(0, 500)}`);
    }
    catch (err) {
        logger_service_1.logger.warn("loadContext failed — returning empty context", { error: err.message });
        return [];
    }
}
