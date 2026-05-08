import { useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatInput from './ChatInput'
import Message from './Message'
import StreamToken from './StreamToken'
import ToolCallBadge from './ToolCallBadge'
import TypingIndicator from './TypingIndicator'
import BootScreen from '../BootScreen'

type Props = {
  theme: 'default' | 'psychedelic'
}

export default function ChatWindow({ theme }: Props) {
  const { messages, isStreaming, activeToolCall, sendMessage, cancelStream } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return <BootScreen theme={theme} onSubmit={sendMessage} />
  }

  return (
    <div
      className="flex flex-col h-full transition-colors duration-700"
      style={{ background: 'rgb(var(--bg) / 0.3)' }}
    >
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.toolCalls?.map((tc, i) => (
              <ToolCallBadge key={`${msg.id}-tc-${i}`} name={tc.name} />
            ))}

            {msg.isStreaming ? (
              <StreamToken content={msg.content} isStreaming />
            ) : msg.error ? (
              <div
                className="mr-auto max-w-[80%] px-3 py-2 rounded-lg text-xs"
                style={{
                  background: 'rgb(255 80 80 / 0.1)',
                  color:      'rgb(255 100 100 / 0.9)',
                  border:     '1px solid rgb(255 80 80 / 0.2)',
                }}
              >
                ⚠ {msg.error}
              </div>
            ) : (
              <Message role={msg.role} content={msg.content} />
            )}
          </div>
        ))}

        {activeToolCall && <ToolCallBadge name={activeToolCall} />}

        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <TypingIndicator />
        )}

        <div ref={bottomRef} />
      </div>

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
        <ChatInput onSubmit={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  )
}
