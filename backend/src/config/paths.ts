import path from "path";
import { config } from "./index";

export const paths = {
  vault:      config.vault.path,
  lancedb:    config.lancedb.path,
  logs:       path.join(process.cwd(), "logs"),
  cache:      path.join(process.cwd(), ".cache"),
  whisperBin: config.whisper.binPath,
};
