// Core chat hook — handles SSE connection, streaming state, and tool result display

export function useChat() {
  const store = useChatStore()

  async function sendMessage(content: string, imageBase64?: string) {
    // SUDO: build new user Message and addMessage to store
    // SUDO: setStreaming(true)
    // SUDO: open EventSource (or fetch with ReadableStream) to POST /api/chat/stream
    // SUDO: on each SSE event:
    //   - parse StreamChunk
    //   - if type === 'token' → appendToken to the current assistant message
    //   - if type === 'tool_call' → show tool indicator in UI (which tool is running)
    //   - if type === 'tool_result' → append result as a styled block
    //   - if type === 'done' → setStreaming(false)
    //   - if type === 'error' → show error state → setStreaming(false)
  }

  return { messages: store.messages, isStreaming: store.isStreaming, sendMessage }
}
