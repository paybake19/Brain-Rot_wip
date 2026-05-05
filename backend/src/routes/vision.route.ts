import { Router, Request, Response } from "express";
import { captureScreen } from "../vision/screen";
import { describeImage } from "../vision/describe";

const router = Router();

router.get("/screenshot", async (_req: Request, res: Response) => {
  try {
    const buffer = await captureScreen();
    const description = await describeImage(buffer);
    res.json({ description });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/describe", async (req: Request, res: Response) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    res.status(400).json({ error: "Missing imageBase64" });
    return;
  }
  try {
    const buffer = Buffer.from(imageBase64, "base64");
    const description = await describeImage(buffer);
    res.json({ description });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
