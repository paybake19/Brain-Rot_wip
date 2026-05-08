import { useRef, useCallback } from "react";
import { useChatStore } from "../store/chat.store";
import { streamChat, type ApiMessage } from "../api/chat.api";

export function useChat() {
  const messages       = useChatStore((s) => s.messages);
  const isStreaming    = useChatStore((s) => s.isStreaming);
  const activeToolCall = useChatStore((s) => s.activeToolCall);

  const addMessage      = useChatStore((s) => s.addMessage);
  const appendToken     = useChatStore((s) => s.appendToken);
  const finalizeMessage = useChatStore((s) => s.finalizeMessage);
  const setStreaming     = useChatStore((s) => s.setStreaming);
  const setActiveToolCall = useChatStore((s) => s.setActiveToolCall);
  const setMessageError = useChatStore((s) => s.setMessageError);
  const pushToolCall    = useChatStore((s) => s.pushToolCall);
  const clearMessages   = useChatStore((s) => s.clearMessages);

  const abortRef     = useRef<AbortController | null>(null);
  const sessionIdRef = useRef(crypto.randomUUID());

  const sendMessage = useCallback(
    async (content: string, imageBase64?: string) => {
      console.log("🔥 sendMessage triggered:", content);

      // Read isStreaming directly from store to avoid stale closure
      if (useChatStore.getState().isStreaming) return;

      addMessage({ role: "user", content });

      const assistantId = addMessage({
        role: "assistant",
        content: "",
        isStreaming: true,
      });

      setStreaming(true);

      const history: ApiMessage[] = useChatStore
        .getState()
        .messages
        .filter((m) => m.id !== assistantId)
        .map(({ id, role, content, timestamp }) => ({ id, role, content, timestamp }));

      abortRef.current = new AbortController();

      try {
        const stream = await streamChat(
          history,
          sessionIdRef.current,
          imageBase64,
          abortRef.current.signal
        );

        for await (const chunk of stream) {
          switch (chunk.type) {
            case "token":
              appendToken(assistantId, chunk.content);
              break;

            case "tool_call":
              try {
                const parsed = JSON.parse(chunk.content);
                pushToolCall(assistantId, { name: parsed.name, args: parsed.args });
                setActiveToolCall(parsed.name);
              } catch (err) {
                console.error("Tool parse error:", err);
              }
              break;

            case "done":
              finalizeMessage(assistantId);
              break;

            case "error":
              setMessageError(assistantId, chunk.content);
              break;
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("Streaming error:", err);
        setMessageError(assistantId, msg);
      } finally {
        setActiveToolCall(null);
        setStreaming(false);
      }
    },
    [addMessage, appendToken, finalizeMessage, setStreaming, setActiveToolCall, setMessageError, pushToolCall]
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    isStreaming,
    activeToolCall,
    sendMessage,
    cancelStream,
    clearMessages,
  };
}
