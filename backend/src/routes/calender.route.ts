import { Router, Request, Response } from "express";

const router = Router();

// Stubbed — wire to CalendarService when Google OAuth is ready
router.get("/events", (_req: Request, res: Response) => {
  res.json({ events: [], message: "Calendar not yet configured" });
});

router.post("/create", (_req: Request, res: Response) => {
  res.status(501).json({ message: "Calendar create not yet configured" });
});

export default router;
