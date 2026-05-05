import { create } from "zustand";
import { nanoid } from "nanoid";

export interface ToolCallDisplay {
  name: string;
  args: Record<string, unknown>;
  result?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallDisplay[];
  isStreaming?: boolean;
  error?: string;
  timestamp: number;
}

interface ChatStore {
  messages: ChatMessage[];
  isStreaming: boolean;
  activeToolCall: string | null;

  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => string;
  appendToken: (id: string, token: string) => void;
  setMessageError: (id: string, error: string) => void;
  pushToolCall: (id: string, toolCall: ToolCallDisplay) => void;
  resolveToolCall: (id: string, toolName: string, result: string) => void;
  finalizeMessage: (id: string) => void;
  setStreaming: (val: boolean) => void;
  setActiveToolCall: (name: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isStreaming: false,
  activeToolCall: null,

  addMessage: (msg) => {
    const id = nanoid();
    set((s) => ({
      messages: [...s.messages, { ...msg, id, timestamp: Date.now() }],
    }));
    return id;
  },

  appendToken: (id, token) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + token } : m
      ),
    })),

  setMessageError: (id, error) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, error, isStreaming: false } : m
      ),
    })),

  pushToolCall: (id, toolCall) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id
          ? { ...m, toolCalls: [...(m.toolCalls ?? []), toolCall] }
          : m
      ),
    })),

  resolveToolCall: (id, toolName, result) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id
          ? {
              ...m,
              toolCalls: (m.toolCalls ?? []).map((tc) =>
                tc.name === toolName ? { ...tc, result } : tc
              ),
            }
          : m
      ),
    })),

  finalizeMessage: (id) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, isStreaming: false } : m
      ),
    })),

  setStreaming: (val) => set({ isStreaming: val }),
  setActiveToolCall: (name) => set({ activeToolCall: name }),
  clearMessages: () => set({ messages: [] }),
}));
