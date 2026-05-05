import { useRef, useCallback } from "react";
import { useChatStore } from "../store/chat.store";
import { streamChat, type ApiMessage } from "../api/chat.api";

export function useChat() {
  const store = useChatStore();
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, imageBase64?: string) => {
      if (store.isStreaming) return;

      // 1. Add user message to store
      store.addMessage({ role: "user", content });

      // 2. Create a blank streaming assistant message
      const assistantId = store.addMessage({
        role: "assistant",
        content: "",
        isStreaming: true,
      });

      store.setStreaming(true);

      // 3. Build message history for API (exclude the blank assistant msg)
      const history: ApiMessage[] = useChatStore
        .getState()
        .messages.filter((m) => m.id !== assistantId)
        .map((m) => ({ role: m.role, content: m.content }));

      // 4. Create abort controller so user can cancel mid-stream
      abortRef.current = new AbortController();

      try {
        const stream = await streamChat(history, imageBase64, abortRef.current.signal);

        for await (const chunk of stream) {
          switch (chunk.type) {
            case "token":
              store.appendToken(assistantId, chunk.content);
              break;

            case "tool_call": {
              // Parse the tool call payload sent by the backend
              try {
                const parsed = JSON.parse(chunk.content) as {
                  name: string;
                  args: Record<string, unknown>;
                };
                store.pushToolCall(assistantId, {
                  name: parsed.name,
                  args: parsed.args,
                });
                store.setActiveToolCall(parsed.name);
              } catch {
                // malformed tool_call chunk — skip
              }
              break;
            }

            case "done":
              store.setActiveToolCall(null);
              store.finalizeMessage(assistantId);
              store.setStreaming(false);
              break;

            case "error":
              store.setMessageError(assistantId, chunk.content);
              store.setActiveToolCall(null);
              store.setStreaming(false);
              break;
          }
        }
      } catch (err: unknown) {
        // Ignore abort — that's intentional cancellation
        if (err instanceof Error && err.name === "AbortError") {
          store.finalizeMessage(assistantId);
        } else {
          const msg = err instanceof Error ? err.message : "Unknown error";
          store.setMessageError(assistantId, msg);
        }
        store.setActiveToolCall(null);
        store.setStreaming(false);
      }
    },
    [store]
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages: store.messages,
    isStreaming: store.isStreaming,
    activeToolCall: store.activeToolCall,
    sendMessage,
    cancelStream,
    clearMessages: store.clearMessages,
  };
}
