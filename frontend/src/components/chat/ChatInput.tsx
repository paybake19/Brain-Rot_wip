import { useState, useRef, KeyboardEvent } from 'react'

/**
 * ChatInput — controlled input for chat messages.
 * Handles Enter (submit) and Shift+Enter (newline).
 * Disabled while the assistant is streaming.
 */
type Props = {
  onSubmit: (text: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSubmit, disabled = false }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-center gap-2 glass px-3 py-2 rounded">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        disabled={disabled}
        className="input flex-1"
        aria-label="Chat message input"
        autoComplete="off"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="btn btn-accent"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  )
}
