export default function TypingIndicator() {
  return (
    <div className="text-xs text-white/40 flex gap-1">
      <span className="animate-pulse">●</span>
      <span className="animate-pulse delay-100">●</span>
      <span className="animate-pulse delay-200">●</span>
    </div>
  )
}
