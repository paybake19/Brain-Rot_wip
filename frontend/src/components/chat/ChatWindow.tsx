import { useRef, useState, useEffect, useCallback } from 'react'
import ChatInput from './ChatInput'
import Message from './Message'
import StreamToken from './StreamToken'
import ToolCallBadge from './ToolCallBadge'
import TypingIndicator from './TypingIndicator'
import { streamChat, ApiMessage } from '../../api/chat.api'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToolCall = {
  id: string
  name: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const buildId = () => crypto.randomUUID()

const toApiMessages = (messages: ChatMessage[]): ApiMessage[] =>
  messages.map(({ role, content }) => ({ role, content }))

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: buildId(), role: 'assistant', content: 'Welcome to Brain Rot.' },
  ])
  const [streamingContent, setStreamingContent] = useState('')
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCall[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Abort any in-flight stream when the component unmounts
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const cancelStream = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const handleSubmit = useCallback(
    async (text: string) => {
      if (isStreaming) return
      setError(null)

      const userMessage: ChatMessage = { id: buildId(), role: 'user', content: text }
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

      setIsStreaming(true)
      setStreamingContent('')
      setActiveToolCalls([])

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const generator = await streamChat(
          toApiMessages(updatedMessages),
          undefined,
          controller.signal
        )

        let accumulated = ''
        const seenToolCalls: ToolCall[] = []

        for await (const chunk of generator) {
          if (chunk.type === 'token') {
            accumulated += chunk.content
            setStreamingContent(accumulated)
          } else if (chunk.type === 'tool_call') {
            try {
              const parsed = JSON.parse(chunk.content) as { name: string }
              const tc: ToolCall = { id: buildId(), name: parsed.name }
              seenToolCalls.push(tc)
              setActiveToolCalls([...seenToolCalls])
            } catch {
              // malformed tool_call payload — skip
            }
          } else if (chunk.type === 'error') {
            setError(chunk.content)
            break
          } else if (chunk.type === 'done') {
            break
          }
        }

        // Commit streamed content as a permanent assistant message
        if (accumulated) {
          setMessages((prev) => [
            ...prev,
            {
              id: buildId(),
              role: 'assistant',
              content: accumulated,
              toolCalls: seenToolCalls.length ? seenToolCalls : undefined,
            },
          ])
        }
      } catch (err: any) {
        // AbortError is intentional (user cancelled) — don't surface as error
        if (err.name !== 'AbortError') {
          setError(err.message ?? 'Unknown error')
        }
      } finally {
        setStreamingContent('')
        setActiveToolCalls([])
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [isStreaming, messages]
  )

  return (
    <div
      className="flex flex-col h-full transition-colors duration-700"
      style={{ background: 'rgb(var(--bg) / 0.3)' }}
    >
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((msg) => (
          <div key={msg.id}>
            {/* Tool calls that fired before this message was committed */}
            {msg.toolCalls?.map((tc) => (
              <ToolCallBadge key={tc.id} name={tc.name} />
            ))}
            <Message role={msg.role} content={msg.content} />
          </div>
        ))}

        {/* Active tool calls firing right now */}
        {activeToolCalls.map((tc) => (
          <ToolCallBadge key={tc.id} name={tc.name} />
        ))}

        {/* Live streaming token */}
        {isStreaming && streamingContent && (
          <StreamToken content={streamingContent} isStreaming />
        )}

        {/* Waiting for first token */}
        {isStreaming && !streamingContent && <TypingIndicator />}

        {/* Error state */}
        {error && (
          <div
            className="mr-auto max-w-[80%] px-3 py-2 rounded-lg text-xs"
            style={{
              background: 'rgb(255 80 80 / 0.1)',
              color:      'rgb(255 100 100 / 0.9)',
              border:     '1px solid rgb(255 80 80 / 0.2)',
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="border-t p-2 transition-colors duration-700"
        style={{ borderColor: 'rgb(var(--text) / 0.06)' }}
      >
        {isStreaming && (
          <div className="flex justify-end mb-1">
            <button
              onClick={cancelStream}
              className="text-[11px] px-2 py-0.5 rounded"
              style={{
                color:      'rgb(var(--text) / 0.45)',
                background: 'rgb(var(--text) / 0.06)',
              }}
            >
              Stop
            </button>
          </div>
        )}
        <ChatInput onSubmit ={handleSubmit} disabled={isStreaming} />
      </div>
    </div>
  )
}
