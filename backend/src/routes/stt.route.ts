import { Router, Request, Response } from "express";
import { sttService } from "../services/stt.service";
import { STTSchema } from "../utils/validate";
import { bus } from "../events/bus";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const parsed = STTSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }
  try {
    const transcript = await sttService.transcribe(
      parsed.data.audioBase64,
      parsed.data.language
    );
    bus.emit("stt:result", { transcript, sessionId: parsed.data.sessionId });
    res.json({ transcript });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
