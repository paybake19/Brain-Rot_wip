import ChatInput from "./ChatInput"
import Message from "./Message"
import TypingIndicator from "./TypingIndicator"

export default function ChatWindow() {
  return (
    <div
      className="flex flex-col h-full transition-colors duration-700"
      style={{ background: 'rgb(var(--bg) / 0.3)' }}
    >
      {/* Message list — uses CSS vars via Message/TypingIndicator components */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <Message role="assistant" content="Welcome to Brain Rot." />
        <Message role="user"      content="Hello." />
        <TypingIndicator />
      </div>

      {/* Input area */}
      <div
        className="border-t p-2 transition-colors duration-700"
        style={{ borderColor: 'rgb(var(--text) / 0.06)' }}
      >
        <ChatInput />
      </div>
    </div>
  )
}
