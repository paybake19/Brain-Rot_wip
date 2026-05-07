"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticSearch = semanticSearch;
const store_1 = require("./store");
const logger_service_1 = require("../services/logger.service");
async function semanticSearch(queryVector, topK = 5) {
    const table = (0, store_1.getTable)();
    if (!table) {
        logger_service_1.logger.warn("Vector search called before store initialized");
        return [];
    }
    try {
        const results = await table.search(queryVector).limit(topK).execute();
        return results.map((r) => ({
            path: r.path,
            chunkIndex: r.chunkIndex,
            content: r.content,
            hash: r.hash,
        }));
    }
    catch (err) {
        logger_service_1.logger.error("semanticSearch failed", { error: err.message });
        return [];
    }
}
