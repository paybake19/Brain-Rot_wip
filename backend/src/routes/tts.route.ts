import { Router, Request, Response } from "express";

const router = Router();

// Stubbed — wire to Piper or equivalent TTS binary when ready
router.post("/speak", (_req: Request, res: Response) => {
  res.status(501).json({ message: "TTS not yet configured" });
});

export default router;
