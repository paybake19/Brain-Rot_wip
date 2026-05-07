"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paths = void 0;
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
exports.paths = {
    vault: index_1.config.vault.path,
    lancedb: index_1.config.lancedb.path,
    logs: path_1.default.join(process.cwd(), "logs"),
    cache: path_1.default.join(process.cwd(), ".cache"),
    whisperBin: index_1.config.whisper.binPath,
};
