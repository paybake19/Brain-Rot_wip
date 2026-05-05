import { Router, Request, Response } from "express";
import { obsidianService } from "../services/obsidian.service";
import { VaultReadSchema } from "../utils/validate";

const router = Router();

router.get("/note", async (req: Request, res: Response) => {
  const parsed = VaultReadSchema.safeParse({ path: req.query.path });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }
  try {
    const note = await obsidianService.readNote(parsed.data.path);
    res.json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/list", async (req: Request, res: Response) => {
  const folder = (req.query.folder as string) || "";
  try {
    const files = await obsidianService.listNotes(folder);
    res.json({ files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) {
    res.status(400).json({ error: "Missing query parameter 'q'" });
    return;
  }
  try {
    const results = await obsidianService.searchVault(query);
    res.json({ results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
