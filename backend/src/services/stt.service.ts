import { execa } from "execa";
import fs from "fs/promises";
import path from "path";
import { paths } from "../config/paths";
import { logger } from "./logger.service";

export class STTService {
  async transcribe(audioBase64: string, language = "en"): Promise<string> {
    const cacheDir = paths.cache;
    await fs.mkdir(cacheDir, { recursive: true });

    const audioPath = path.join(cacheDir, `stt_${Date.now()}.wav`);
    const buffer = Buffer.from(audioBase64, "base64");
    await fs.writeFile(audioPath, buffer);

    try {
      await execa(paths.whisperBin, [
        audioPath,
        "--language", language,
        "--output-txt",
        "--output-dir", cacheDir,
      ]);

      const txtPath = audioPath.replace(".wav", ".txt");
      const transcript = await fs.readFile(txtPath, "utf-8");

      await fs.unlink(audioPath).catch(() => {});
      await fs.unlink(txtPath).catch(() => {});

      return transcript.trim();
    } catch (err: any) {
      logger.error("STTService.transcribe failed", { error: err.message });
      throw err;
    }
  }
}

export const sttService = new STTService();
