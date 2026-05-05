import { Router, Request, Response } from "express";
import { navigate, clickElement } from "../browser/actions";
import { scrapePage } from "../browser/scraper";
import {
  BrowserNavigateSchema,
  BrowserClickSchema,
} from "../utils/validate";

const router = Router();

router.post("/navigate", async (req: Request, res: Response) => {
  const parsed = BrowserNavigateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid URL" });
    return;
  }
  try {
    await navigate(parsed.data.url);
    res.json({ success: true, url: parsed.data.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/click", async (req: Request, res: Response) => {
  const parsed = BrowserClickSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid selector" });
    return;
  }
  try {
    await clickElement(parsed.data.selector);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/scrape", async (_req: Request, res: Response) => {
  try {
    const result = await scrapePage();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
