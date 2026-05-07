"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
exports.models = {
    "gemma4:e4b": {
        contextWindow: 8192,
        defaultTemp: 0.3,
        supportsVision: true,
        supportsTools: true,
    },
    "nomic-embed-text": {
        contextWindow: 8192,
        defaultTemp: 0,
        supportsVision: false,
        supportsTools: false,
    },
};
