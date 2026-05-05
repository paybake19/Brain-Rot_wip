/**
 * Represents a single chat message.
 * @param sender - The unique identifier of the user who sent the message.
 * @param content - The textual content of the message.
 * @param timestamp - The time the message was sent (ISO string or number).
 * @param attachments - An optional array of attached files or media.
 */

export type Role = "user" | "admin" | "system" | "tool";

export interface Message {
  sender: string;
  role: Role;
  content: string;
  timestamp: Date | string;
  attachments?: { type: string; url: string }[];
}

/**
 * Represents a chat session or conversation.
 */
export interface ChatSession {
  sessionId: string;
  participants: string[];
  history: Message[];
  lastActive: Date;
}

export interface StreamChunk {
  type: "token" | "tool_call" | "tool_result" | "done" | "error";
  content: string | object;
}

/**
 * Enumeration for possible chat message status.
 */
export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  ERROR = 'error',
}
