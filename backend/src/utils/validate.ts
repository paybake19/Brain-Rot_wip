import { z } from "zod";

export const ChatRequestSchema = z.object({
  sessionId: z.string().uuid(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "assistant", "system", "tool"]),
      content: z.string(),
      timestamp: z.number(),
    })
  ),
  imageBase64: z.string().optional(),
});

export const VaultReadSchema = z.object({
  path: z.string().min(1),
});

export const STTSchema = z.object({
  audioBase64: z.string(),
  language: z.string().default("en"),
  sessionId: z.string().uuid(),
});

export const ShellSchema = z.object({
  command: z.string().min(1),
});

export const ClipboardWriteSchema = z.object({
  text: z.string().min(1),
});

export const BrowserNavigateSchema = z.object({
  url: z.string().url(),
});

export const BrowserClickSchema = z.object({
  selector: z.string().min(1),
});
