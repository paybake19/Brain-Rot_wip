export default function ChatInput() {
  return (
    <div className="flex items-center gap-2 glass px-3 py-2 rounded">

      <input
        placeholder="Message..."
        className="input flex-1"
      />

      <button className="btn btn-accent">
        Send
      </button>
    </div>
  )
}
