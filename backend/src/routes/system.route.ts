import { Router, Request, Response } from "express";
import { desktopService } from "../services/desktop.service";
import { runShellTool } from "../tools/runShell.tool";
import { ShellSchema, ClipboardWriteSchema } from "../utils/validate";

const router = Router();

router.post("/shell", async (req: Request, res: Response) => {
  const parsed = ShellSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid command" });
    return;
  }
  try {
    const output = await runShellTool({ command: parsed.data.command });
    res.json({ output });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/clipboard", async (_req: Request, res: Response) => {
  try {
    const content = await desktopService.getClipboard();
    res.json({ content });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/clipboard", async (req: Request, res: Response) => {
  const parsed = ClipboardWriteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid text" });
    return;
  }
  try {
    await desktopService.setClipboard(parsed.data.text);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
