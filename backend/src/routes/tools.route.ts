import { Router } from "express";
import { toolRegistry } from "../tools/registry";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ tools: toolRegistry });
});

export default router;
