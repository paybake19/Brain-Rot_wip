"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initVectorStore = initVectorStore;
exports.upsertChunks = upsertChunks;
exports.deleteNote = deleteNote;
exports.getTable = getTable;
const paths_1 = require("../config/paths");
const logger_service_1 = require("../services/logger.service");
let db = null;
let table = null;
async function initVectorStore() {
    const lancedb = await Promise.resolve().then(() => __importStar(require("vectordb")));
    db = await lancedb.connect(paths_1.paths.lancedb);
    const tableNames = await db.tableNames();
    if (tableNames.includes("vault_chunks")) {
        table = await db.openTable("vault_chunks");
    }
    else {
        table = await db.createTable("vault_chunks", [
            {
                path: "__init__",
                chunkIndex: 0,
                content: "",
                hash: "",
                vector: Array(768).fill(0),
            },
        ]);
    }
    logger_service_1.logger.info("Vector store ready", { path: paths_1.paths.lancedb });
}
async function upsertChunks(chunks, vectors) {
    if (!table)
        throw new Error("Vector store not initialized");
    const rows = chunks.map((chunk, i) => ({
        path: chunk.path,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        hash: chunk.hash,
        vector: vectors[i],
    }));
    await table.add(rows);
}
async function deleteNote(notePath) {
    if (!table)
        return;
    await table.delete(`path = '${notePath.replace(/'/g, "''")}'`);
}
function getTable() {
    return table;
}
