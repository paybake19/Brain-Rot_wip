"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startVaultWatcher = startVaultWatcher;
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../config/paths");
const bus_1 = require("../events/bus");
const hash_1 = require("../utils/hash");
const logger_service_1 = require("../services/logger.service");
const hashCache = new Map();
function debounce(fn, delay) {
    const timers = new Map();
    return ((...args) => {
        const key = args[0];
        const existing = timers.get(key);
        if (existing)
            clearTimeout(existing);
        timers.set(key, setTimeout(() => fn(...args), delay));
    });
}
const handleChange = debounce((filePath) => {
    if (!filePath.endsWith(".md"))
        return;
    try {
        const content = fs_1.default.readFileSync(filePath, "utf-8");
        const hash = (0, hash_1.sha256)(content);
        if (hashCache.get(filePath) === hash)
            return;
        hashCache.set(filePath, hash);
        bus_1.bus.emit("vault:changed", { path: filePath, hash });
        logger_service_1.logger.info("Vault file changed", { path: filePath });
    }
    catch (err) {
        logger_service_1.logger.error("Watcher read error", { filePath, error: err.message });
    }
}, 1500);
function startVaultWatcher() {
    if (!paths_1.paths.vault) {
        logger_service_1.logger.warn("VAULT_PATH not set — watcher disabled");
        return;
    }
    fs_1.default.watch(paths_1.paths.vault, { recursive: true }, (_event, filename) => {
        if (filename)
            handleChange(`${paths_1.paths.vault}\\${filename}`);
    });
    logger_service_1.logger.info("Vault watcher active", { path: paths_1.paths.vault });
}
