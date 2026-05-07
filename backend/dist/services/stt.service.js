"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sttService = exports.STTService = void 0;
const execa_1 = __importDefault(require("execa"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../config/paths");
const logger_service_1 = require("./logger.service");
class STTService {
    async transcribe(audioBase64, language = "en") {
        const cacheDir = paths_1.paths.cache;
        await promises_1.default.mkdir(cacheDir, { recursive: true });
        const audioPath = path_1.default.join(cacheDir, `stt_${Date.now()}.wav`);
        const buffer = Buffer.from(audioBase64, "base64");
        await promises_1.default.writeFile(audioPath, buffer);
        try {
            await (0, execa_1.default)(paths_1.paths.whisperBin, [
                audioPath,
                "--language", language,
                "--output-txt",
                "--output-dir", cacheDir,
            ]);
            const txtPath = audioPath.replace(".wav", ".txt");
            const transcript = await promises_1.default.readFile(txtPath, "utf-8");
            await promises_1.default.unlink(audioPath).catch(() => { });
            await promises_1.default.unlink(txtPath).catch(() => { });
            return transcript.trim();
        }
        catch (err) {
            logger_service_1.logger.error("STTService.transcribe failed", { error: err.message });
            throw err;
        }
    }
}
exports.STTService = STTService;
exports.sttService = new STTService();
