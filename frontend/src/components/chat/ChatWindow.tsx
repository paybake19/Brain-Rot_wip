import ChatInput from "./ChatInput"
import Message from "./Message"
import TypingIndicator from "./TypingIndicator"

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <Message role="assistant" content="Welcome to Brain Rot." />
        <Message role="user" content="Hello." />
        <TypingIndicator />
      </div>

      <div className="border-t border-white/10 p-2">
        <ChatInput />
      </div>
    </div>
  )
}
