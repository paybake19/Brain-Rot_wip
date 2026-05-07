/**
 * StreamToken — renders an in-progress streamed assistant message.
 * Displays accumulated content with a blinking cursor while streaming.
 * Cursor disappears once streaming is complete.
 */
type Props = {
  content: string
  isStreaming?: boolean
}

export default function StreamToken({ content, isStreaming = true }: Props) {
  return (
    <div
      className="max-w-[80%] mr-auto px-3 py-2 rounded-lg text-sm"
      style={{ background: 'rgb(var(--bg) / 0.5)', color: 'rgb(var(--text) / 0.85)' }}
    >
      <span>{content}</span>
      {isStreaming && (
        <span
          className="inline-block w-[2px] h-[13px] ml-[2px] align-middle animate-pulse"
          style={{ background: 'rgb(var(--accent))' }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
